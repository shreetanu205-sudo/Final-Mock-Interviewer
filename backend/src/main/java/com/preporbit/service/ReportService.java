package com.preporbit.service;

import com.preporbit.ai.AiServiceFactory;
import com.preporbit.dto.ReportDTOs;
import com.preporbit.exception.ResourceNotFoundException;
import com.preporbit.model.Interview;
import com.preporbit.model.Report;
import com.preporbit.model.Response;
import com.preporbit.repository.InterviewRepository;
import com.preporbit.repository.ReportRepository;
import com.preporbit.repository.ResponseRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final InterviewRepository interviewRepository;
    private final ResponseRepository responseRepository;
    private final AiServiceFactory aiFactory;

    public ReportService(
            ReportRepository reportRepository,
            InterviewRepository interviewRepository,
            ResponseRepository responseRepository,
            AiServiceFactory aiFactory
    ) {
        this.reportRepository = reportRepository;
        this.interviewRepository = interviewRepository;
        this.responseRepository = responseRepository;
        this.aiFactory = aiFactory;
    }

    public ReportDTOs.ReportResponse generateReport(String interviewId, String userId) {
        Interview interview = interviewRepository.findByIdAndUserId(interviewId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));

        Optional<Report> existing = reportRepository.findByInterviewId(interviewId);
        if (existing.isPresent()) {
            return toDto(existing.get(), interview);
        }

        List<Response> responses = responseRepository.findByInterviewIdOrderByAnsweredAtAsc(interviewId);
        List<Map<String, Object>> evalMaps = new ArrayList<>();
        for (Response r : responses) {
            Map<String, Object> m = new HashMap<>();
            m.put("questionId", r.getQuestionId());
            m.put("questionText", r.getQuestionText());
            m.put("candidateAnswer", r.getCandidateAnswer());
            m.put("isSkipped", r.isSkipped());
            m.put("score", r.getScore());
            m.put("rubricScores", r.getRubricScores());
            m.put("whatWasDoneWell", r.getWhatWasDoneWell());
            m.put("missingConcepts", r.getMissingConcepts());
            m.put("areasForImprovement", r.getAreasForImprovement());
            m.put("suggestedBetterAnswer", r.getSuggestedBetterAnswer());
            evalMaps.add(m);
        }

        Map<String, Object> aiReport = aiFactory.getClient().generateFinalReport(
                interview.getJobRole(),
                interview.getDifficulty(),
                interview.getTargetSkills(),
                interview.getTotalBatches(),
                evalMaps
        );

        Report report = new Report();
        report.setInterviewId(interviewId);
        report.setUserId(userId);

        double overallScore = ((Number) aiReport.getOrDefault("overallScore", interview.getOverallScore())).doubleValue();
        report.setOverallScore(Math.round(overallScore * 10.0) / 10.0);
        report.setReadinessTier((String) aiReport.getOrDefault("readinessTier", "Interview Ready"));
        report.setTotalQuestions(((Number) aiReport.getOrDefault("totalQuestions", responses.size())).intValue());
        report.setAttemptedQuestions(((Number) aiReport.getOrDefault("attemptedQuestions", (int) responses.stream().filter(r -> !r.isSkipped()).count())).intValue());
        report.setSkippedQuestions(((Number) aiReport.getOrDefault("skippedQuestions", (int) responses.stream().filter(Response::isSkipped).count())).intValue());
        report.setExecutiveSummary((String) aiReport.getOrDefault("executiveSummary", "Candidate demonstrated solid mastery."));

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> skillScores = (List<Map<String, Object>>) aiReport.get("skillScores");
        report.setSkillScores(skillScores != null ? skillScores : new ArrayList<>());

        @SuppressWarnings("unchecked")
        List<String> strongest = (List<String>) aiReport.get("strongestAreas");
        report.setStrongestAreas(strongest != null ? strongest : List.of("Problem-solving", "API Design"));

        @SuppressWarnings("unchecked")
        List<String> weakest = (List<String>) aiReport.get("weakestAreas");
        report.setWeakestAreas(weakest != null ? weakest : List.of("Edge-case handling"));

        @SuppressWarnings("unchecked")
        List<String> missing = (List<String>) aiReport.get("missingTechnicalConcepts");
        report.setMissingTechnicalConcepts(missing != null ? missing : List.of("Concurrency locks"));

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> plan = (List<Map<String, Object>>) aiReport.get("actionableImprovementPlan");
        report.setActionableImprovementPlan(plan != null ? plan : new ArrayList<>());

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> topics = (List<Map<String, Object>>) aiReport.get("recommendedStudyTopics");
        report.setRecommendedStudyTopics(topics != null ? topics : new ArrayList<>());

        report.setGeneratedAt(Instant.now());

        Report saved = reportRepository.save(report);
        return toDto(saved, interview);
    }

    public ReportDTOs.ReportResponse getReportByInterviewId(String interviewId, String userId) {
        Interview interview = interviewRepository.findByIdAndUserId(interviewId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));

        Report report = reportRepository.findByInterviewId(interviewId)
                .orElseGet(() -> {
                    // Generate report if not already cached
                    return generateReportEntity(interviewId, userId, interview);
                });

        return toDto(report, interview);
    }

    private Report generateReportEntity(String interviewId, String userId, Interview interview) {
        List<Response> responses = responseRepository.findByInterviewIdOrderByAnsweredAtAsc(interviewId);
        List<Map<String, Object>> evalMaps = new ArrayList<>();
        for (Response r : responses) {
            Map<String, Object> m = new HashMap<>();
            m.put("questionId", r.getQuestionId());
            m.put("questionText", r.getQuestionText());
            m.put("candidateAnswer", r.getCandidateAnswer());
            m.put("isSkipped", r.isSkipped());
            m.put("score", r.getScore());
            m.put("rubricScores", r.getRubricScores());
            m.put("whatWasDoneWell", r.getWhatWasDoneWell());
            m.put("missingConcepts", r.getMissingConcepts());
            m.put("areasForImprovement", r.getAreasForImprovement());
            m.put("suggestedBetterAnswer", r.getSuggestedBetterAnswer());
            evalMaps.add(m);
        }

        Map<String, Object> aiReport = aiFactory.getClient().generateFinalReport(
                interview.getJobRole(),
                interview.getDifficulty(),
                interview.getTargetSkills(),
                interview.getTotalBatches(),
                evalMaps
        );

        Report report = new Report();
        report.setInterviewId(interviewId);
        report.setUserId(userId);
        double overallScore = ((Number) aiReport.getOrDefault("overallScore", interview.getOverallScore())).doubleValue();
        report.setOverallScore(Math.round(overallScore * 10.0) / 10.0);
        report.setReadinessTier((String) aiReport.getOrDefault("readinessTier", "Interview Ready"));
        report.setTotalQuestions(((Number) aiReport.getOrDefault("totalQuestions", responses.size())).intValue());
        report.setAttemptedQuestions(((Number) aiReport.getOrDefault("attemptedQuestions", (int) responses.stream().filter(r -> !r.isSkipped()).count())).intValue());
        report.setSkippedQuestions(((Number) aiReport.getOrDefault("skippedQuestions", (int) responses.stream().filter(Response::isSkipped).count())).intValue());
        report.setExecutiveSummary((String) aiReport.getOrDefault("executiveSummary", "Candidate demonstrated solid mastery."));

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> skillScores = (List<Map<String, Object>>) aiReport.get("skillScores");
        report.setSkillScores(skillScores != null ? skillScores : new ArrayList<>());

        @SuppressWarnings("unchecked")
        List<String> strongest = (List<String>) aiReport.get("strongestAreas");
        report.setStrongestAreas(strongest != null ? strongest : List.of("Problem-solving", "API Design"));

        @SuppressWarnings("unchecked")
        List<String> weakest = (List<String>) aiReport.get("weakestAreas");
        report.setWeakestAreas(weakest != null ? weakest : List.of("Edge-case handling"));

        @SuppressWarnings("unchecked")
        List<String> missing = (List<String>) aiReport.get("missingTechnicalConcepts");
        report.setMissingTechnicalConcepts(missing != null ? missing : List.of("Concurrency locks"));

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> plan = (List<Map<String, Object>>) aiReport.get("actionableImprovementPlan");
        report.setActionableImprovementPlan(plan != null ? plan : new ArrayList<>());

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> topics = (List<Map<String, Object>>) aiReport.get("recommendedStudyTopics");
        report.setRecommendedStudyTopics(topics != null ? topics : new ArrayList<>());
        report.setGeneratedAt(Instant.now());

        return reportRepository.save(report);
    }

    public List<ReportDTOs.ReportResponse> getUserReports(String userId) {
        List<Report> reports = reportRepository.findByUserIdOrderByGeneratedAtDesc(userId);
        List<ReportDTOs.ReportResponse> list = new ArrayList<>();
        for (Report r : reports) {
            Interview interview = interviewRepository.findById(r.getInterviewId()).orElse(new Interview());
            list.add(toDto(r, interview));
        }
        return list;
    }

    private ReportDTOs.ReportResponse toDto(Report r, Interview i) {
        ReportDTOs.ReportResponse dto = new ReportDTOs.ReportResponse();
        dto.setId(r.getId());
        dto.setInterviewId(r.getInterviewId());
        dto.setUserId(r.getUserId());
        dto.setJobRole(i.getJobRole() != null ? i.getJobRole() : "Software Engineer");
        dto.setDifficulty(i.getDifficulty() != null ? i.getDifficulty() : "Intermediate");
        dto.setTargetSkills(i.getTargetSkills() != null ? i.getTargetSkills() : Collections.emptyList());
        dto.setOverallScore(r.getOverallScore());
        dto.setReadinessTier(r.getReadinessTier());
        dto.setTotalQuestions(r.getTotalQuestions());
        dto.setAttemptedQuestions(r.getAttemptedQuestions());
        dto.setSkippedQuestions(r.getSkippedQuestions());
        dto.setExecutiveSummary(r.getExecutiveSummary());
        dto.setSkillScores(r.getSkillScores());
        dto.setStrongestAreas(r.getStrongestAreas());
        dto.setWeakestAreas(r.getWeakestAreas());
        dto.setMissingTechnicalConcepts(r.getMissingTechnicalConcepts());
        dto.setActionableImprovementPlan(r.getActionableImprovementPlan());
        dto.setRecommendedStudyTopics(r.getRecommendedStudyTopics());
        dto.setGeneratedAt(r.getGeneratedAt());

        // Attach question-level evaluations
        List<Response> responses = responseRepository.findByInterviewIdOrderByAnsweredAtAsc(r.getInterviewId());
        List<Map<String, Object>> qEvals = new ArrayList<>();
        for (Response res : responses) {
            Map<String, Object> item = new HashMap<>();
            item.put("questionId", res.getQuestionId());
            item.put("questionText", res.getQuestionText());
            item.put("candidateAnswer", res.getCandidateAnswer());
            item.put("isSkipped", res.isSkipped());
            item.put("score", res.getScore());
            item.put("rubricScores", res.getRubricScores());
            item.put("whatWasDoneWell", res.getWhatWasDoneWell());
            item.put("missingConcepts", res.getMissingConcepts());
            item.put("areasForImprovement", res.getAreasForImprovement());
            item.put("suggestedBetterAnswer", res.getSuggestedBetterAnswer());
            qEvals.add(item);
        }
        dto.setQuestionEvaluations(qEvals);

        return dto;
    }
}
