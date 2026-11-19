package com.preporbit.service;

import com.preporbit.ai.AiServiceFactory;
import com.preporbit.dto.InterviewDTOs;
import com.preporbit.exception.BadRequestException;
import com.preporbit.exception.ResourceNotFoundException;
import com.preporbit.model.*;
import com.preporbit.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class InterviewService {

    private static final Logger logger = LoggerFactory.getLogger(InterviewService.class);

    private final InterviewRepository interviewRepository;
    private final QuestionBatchRepository batchRepository;
    private final ResponseRepository responseRepository;
    private final ResumeRepository resumeRepository;
    private final AiServiceFactory aiFactory;
    private final ReportService reportService;

    public InterviewService(
            InterviewRepository interviewRepository,
            QuestionBatchRepository batchRepository,
            ResponseRepository responseRepository,
            ResumeRepository resumeRepository,
            AiServiceFactory aiFactory,
            ReportService reportService
    ) {
        this.interviewRepository = interviewRepository;
        this.batchRepository = batchRepository;
        this.responseRepository = responseRepository;
        this.resumeRepository = resumeRepository;
        this.aiFactory = aiFactory;
        this.reportService = reportService;
    }

    public InterviewDTOs.InterviewSummaryResponse createInterview(String userId, InterviewDTOs.CreateInterviewRequest request) {
        Interview interview = new Interview();
        interview.setUserId(userId);
        interview.setJobRole(request.getJobRole().trim());
        interview.setTargetSkills(request.getTargetSkills());
        interview.setDifficulty(request.getDifficulty());
        interview.setCategory(request.getCategory());
        interview.setMode(request.getMode() != null ? request.getMode() : "text");
        interview.setTotalQuestions(request.getTotalQuestions());
        interview.setResumeId(request.getResumeId());
        interview.setCurrentBatchNumber(1);
        interview.setStatus("IN_PROGRESS");
        interview.setCreatedAt(Instant.now());

        Interview saved = interviewRepository.save(interview);

        // Pre-generate Batch 1 of 5 questions immediately so the user can start practicing instantly!
        generateBatchForInterview(saved, 1);

        return toSummaryDto(saved);
    }

    public InterviewDTOs.BatchResponse generateBatchForInterview(Interview interview, int batchNumber) {
        // Check if batch already exists
        Optional<QuestionBatch> existingBatch = batchRepository.findByInterviewIdAndBatchNumber(interview.getId(), batchNumber);
        if (existingBatch.isPresent()) {
            return toBatchDto(existingBatch.get(), interview.getTotalBatches());
        }

        // Gather resume context if available
        String resumeContext = "";
        if (interview.getResumeId() != null) {
            resumeRepository.findById(interview.getResumeId()).ifPresent(r -> {
                StringBuilder sb = new StringBuilder();
                if (r.getProfessionalSummary() != null) sb.append("Summary: ").append(r.getProfessionalSummary()).append(". ");
                if (!r.getTechnicalSkills().isEmpty()) sb.append("Skills: ").append(String.join(", ", r.getTechnicalSkills())).append(". ");
                if (!r.getProjects().isEmpty()) sb.append("Projects: ").append(r.getProjects().size()).append(" projects on resume. ");
            });
        }

        // Gather previous batch performance context for adaptive tuning
        String previousBatchContext = "";
        if (batchNumber > 1) {
            Optional<QuestionBatch> prevBatch = batchRepository.findByInterviewIdAndBatchNumber(interview.getId(), batchNumber - 1);
            if (prevBatch.isPresent()) {
                previousBatchContext = "Previous batch scored " + prevBatch.get().getBatchScore() + "/100. " + prevBatch.get().getBatchSummary();
            }
        }

        List<Question> questions = aiFactory.getClient().generateQuestionBatch(
                batchNumber,
                interview.getTotalBatches(),
                interview.getJobRole(),
                interview.getTargetSkills(),
                interview.getDifficulty(),
                interview.getCategory(),
                resumeContext,
                previousBatchContext
        );

        QuestionBatch batch = new QuestionBatch(interview.getId(), batchNumber, questions);
        QuestionBatch savedBatch = batchRepository.save(batch);

        return toBatchDto(savedBatch, interview.getTotalBatches());
    }

    public InterviewDTOs.BatchResponse getBatch(String interviewId, String userId, int batchNumber) {
        Interview interview = interviewRepository.findByIdAndUserId(interviewId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));

        Optional<QuestionBatch> batchOpt = batchRepository.findByInterviewIdAndBatchNumber(interviewId, batchNumber);
        if (batchOpt.isPresent()) {
            return toBatchDto(batchOpt.get(), interview.getTotalBatches());
        }

        // Generate batch if within totalBatches limit
        if (batchNumber <= interview.getTotalBatches()) {
            return generateBatchForInterview(interview, batchNumber);
        }

        throw new BadRequestException("Batch number " + batchNumber + " exceeds total batches (" + interview.getTotalBatches() + ")");
    }

    public InterviewDTOs.BatchEvaluationResponse submitBatch(String interviewId, String userId, InterviewDTOs.SubmitBatchRequest request) {
        Interview interview = interviewRepository.findByIdAndUserId(interviewId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));

        int batchNumber = request.getBatchNumber();
        QuestionBatch batch = batchRepository.findByInterviewIdAndBatchNumber(interviewId, batchNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Batch " + batchNumber + " not found"));

        if (batch.isSubmitted()) {
            logger.info("Batch {} already submitted, returning existing evaluations", batchNumber);
        }

        // Prepare question-answer pairs for AI evaluation
        List<Map<String, Object>> qaList = new ArrayList<>();
        Map<String, Question> questionMap = new HashMap<>();
        for (Question q : batch.getQuestions()) {
            questionMap.put(q.getId(), q);
        }

        for (InterviewDTOs.QuestionAnswerSubmit ans : request.getAnswers()) {
            Map<String, Object> qa = new HashMap<>();
            qa.put("questionId", ans.getQuestionId());
            Question q = questionMap.get(ans.getQuestionId());
            qa.put("questionText", q != null ? q.getText() : ans.getQuestionText());
            qa.put("answer", ans.getAnswer());
            qa.put("isSkipped", ans.isSkipped());
            qaList.add(qa);
        }

        // Run batch evaluation via AI
        Map<String, Object> evalResult = aiFactory.getClient().evaluateBatch(
                batchNumber,
                interview.getJobRole(),
                interview.getDifficulty(),
                qaList
        );

        double batchScore = ((Number) evalResult.getOrDefault("batchScore", 75.0)).doubleValue();
        String batchSummary = (String) evalResult.getOrDefault("batchSummary", "Batch successfully evaluated.");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> evals = (List<Map<String, Object>>) evalResult.getOrDefault("evaluations", Collections.emptyList());

        // Save individual question responses with evaluation metrics
        for (Map<String, Object> ev : evals) {
            String qId = (String) ev.get("questionId");
            Response response = responseRepository.findByInterviewIdAndQuestionId(interviewId, qId)
                    .orElse(new Response());

            response.setInterviewId(interviewId);
            response.setBatchId(batch.getId());
            response.setBatchNumber(batchNumber);
            response.setQuestionId(qId);
            response.setQuestionText((String) ev.get("questionText"));
            response.setCandidateAnswer((String) ev.get("candidateAnswer"));
            response.setSkipped(Boolean.TRUE.equals(ev.get("isSkipped")));

            Object sc = ev.get("score");
            response.setScore(sc instanceof Number ? ((Number) sc).doubleValue() : 75.0);

            @SuppressWarnings("unchecked")
            Map<String, Double> rubrics = (Map<String, Double>) ev.get("rubricScores");
            response.setRubricScores(rubrics != null ? rubrics : new HashMap<>());

            response.setWhatWasDoneWell((String) ev.get("whatWasDoneWell"));
            @SuppressWarnings("unchecked")
            List<String> missing = (List<String>) ev.get("missingConcepts");
            response.setMissingConcepts(missing != null ? missing : new ArrayList<>());

            response.setAreasForImprovement((String) ev.get("areasForImprovement"));
            response.setSuggestedBetterAnswer((String) ev.get("suggestedBetterAnswer"));

            // find corresponding audio metadata
            for (InterviewDTOs.QuestionAnswerSubmit ans : request.getAnswers()) {
                if (qId.equals(ans.getQuestionId()) && ans.getAudioMetadata() != null) {
                    response.setAudioMetadata(ans.getAudioMetadata());
                }
            }

            response.setAnsweredAt(Instant.now());
            responseRepository.save(response);
        }

        // Update question batch
        batch.setSubmitted(true);
        batch.setBatchScore(batchScore);
        batch.setBatchSummary(batchSummary);
        batch.setSubmittedAt(Instant.now());
        batchRepository.save(batch);

        // Calculate running overall score
        List<QuestionBatch> allBatches = batchRepository.findByInterviewIdOrderByBatchNumberAsc(interviewId);
        double totalSum = 0;
        int submittedCount = 0;
        for (QuestionBatch b : allBatches) {
            if (b.isSubmitted()) {
                totalSum += b.getBatchScore();
                submittedCount++;
            }
        }
        double runningScore = submittedCount > 0 ? (totalSum / submittedCount) : batchScore;
        interview.setOverallScore(Math.round(runningScore * 10.0) / 10.0);

        boolean isInterviewComplete = batchNumber >= interview.getTotalBatches();
        boolean nextBatchAvailable = batchNumber < interview.getTotalBatches();

        if (nextBatchAvailable) {
            interview.setCurrentBatchNumber(batchNumber + 1);
            // Pre-generate next batch
            generateBatchForInterview(interview, batchNumber + 1);
        } else {
            interview.setStatus("COMPLETED");
            interview.setCompletedAt(Instant.now());
        }
        interviewRepository.save(interview);

        // If completed, trigger final report generation
        if (isInterviewComplete) {
            try {
                reportService.generateReport(interviewId, userId);
            } catch (Exception e) {
                logger.error("Failed to automatically generate final report upon interview completion", e);
            }
        }

        InterviewDTOs.BatchEvaluationResponse response = new InterviewDTOs.BatchEvaluationResponse();
        response.setInterviewId(interviewId);
        response.setBatchNumber(batchNumber);
        response.setTotalBatches(interview.getTotalBatches());
        response.setBatchScore(batchScore);
        response.setBatchSummary(batchSummary);
        response.setEvaluations(evals);
        response.setInterviewComplete(isInterviewComplete);
        response.setNextBatchAvailable(nextBatchAvailable);
        response.setRunningOverallScore(interview.getOverallScore());

        return response;
    }

    public InterviewDTOs.InterviewSummaryResponse completeInterview(String interviewId, String userId) {
        Interview interview = interviewRepository.findByIdAndUserId(interviewId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));

        interview.setStatus("COMPLETED");
        interview.setCompletedAt(Instant.now());
        Interview saved = interviewRepository.save(interview);

        // Ensure final report is generated
        try {
            reportService.generateReport(interviewId, userId);
        } catch (Exception e) {
            logger.error("Error generating report during manual completion", e);
        }

        return toSummaryDto(saved);
    }

    public List<InterviewDTOs.InterviewSummaryResponse> getUserInterviews(String userId) {
        return interviewRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toSummaryDto)
                .toList();
    }

    public InterviewDTOs.InterviewSummaryResponse getInterviewById(String interviewId, String userId) {
        Interview interview = interviewRepository.findByIdAndUserId(interviewId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));
        return toSummaryDto(interview);
    }

    private InterviewDTOs.InterviewSummaryResponse toSummaryDto(Interview i) {
        InterviewDTOs.InterviewSummaryResponse dto = new InterviewDTOs.InterviewSummaryResponse();
        dto.setId(i.getId());
        dto.setJobRole(i.getJobRole());
        dto.setTargetSkills(i.getTargetSkills());
        dto.setDifficulty(i.getDifficulty());
        dto.setCategory(i.getCategory());
        dto.setMode(i.getMode());
        dto.setTotalQuestions(i.getTotalQuestions());
        dto.setTotalBatches(i.getTotalBatches());
        dto.setCurrentBatchNumber(i.getCurrentBatchNumber());
        dto.setStatus(i.getStatus());
        dto.setOverallScore(i.getOverallScore());
        dto.setCreatedAt(i.getCreatedAt());
        dto.setCompletedAt(i.getCompletedAt());
        return dto;
    }

    private InterviewDTOs.BatchResponse toBatchDto(QuestionBatch b, int totalBatches) {
        InterviewDTOs.BatchResponse dto = new InterviewDTOs.BatchResponse();
        dto.setBatchId(b.getId());
        dto.setInterviewId(b.getInterviewId());
        dto.setBatchNumber(b.getBatchNumber());
        dto.setTotalBatches(totalBatches);
        dto.setQuestions(b.getQuestions());
        dto.setSubmitted(b.isSubmitted());
        dto.setBatchScore(b.getBatchScore());
        dto.setBatchSummary(b.getBatchSummary());
        return dto;
    }
}
