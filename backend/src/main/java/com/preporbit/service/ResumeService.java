package com.preporbit.service;

import com.preporbit.ai.AiServiceFactory;
import com.preporbit.dto.ResumeDTOs;
import com.preporbit.exception.BadRequestException;
import com.preporbit.exception.ResourceNotFoundException;
import com.preporbit.model.Resume;
import com.preporbit.repository.ResumeRepository;
import com.preporbit.resume.AtsEvaluator;
import com.preporbit.resume.ResumeParserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.*;

@Service
public class ResumeService {

    private static final Logger logger = LoggerFactory.getLogger(ResumeService.class);

    private final ResumeRepository resumeRepository;
    private final ResumeParserService parserService;
    private final AtsEvaluator atsEvaluator;
    private final AiServiceFactory aiFactory;

    public ResumeService(ResumeRepository resumeRepository, ResumeParserService parserService, AtsEvaluator atsEvaluator, AiServiceFactory aiFactory) {
        this.resumeRepository = resumeRepository;
        this.parserService = parserService;
        this.atsEvaluator = atsEvaluator;
        this.aiFactory = aiFactory;
    }

    public ResumeDTOs.ResumeUploadResponse uploadAndAnalyze(String userId, MultipartFile file, String targetJobDescription) {
        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded file is empty");
        }

        String filename = file.getOriginalFilename();
        if (filename == null) filename = "resume";

        String rawText;
        try {
            rawText = parserService.extractText(file);
        } catch (Exception e) {
            logger.error("Failed to parse resume document", e);
            throw new BadRequestException("Failed to extract text from document: " + e.getMessage());
        }

        // Baseline local parsing
        Map<String, Object> localData = parserService.parseResumeLocally(rawText);
        @SuppressWarnings("unchecked")
        List<String> extractedSkills = (List<String>) localData.getOrDefault("technicalSkills", Collections.emptyList());

        // Baseline rule-based ATS evaluation
        Map<String, Object> atsResult = atsEvaluator.evaluateAts(rawText, targetJobDescription, extractedSkills);
        double totalAtsScore = ((Number) atsResult.get("totalScore")).doubleValue();
        @SuppressWarnings("unchecked")
        Map<String, Object> atsBreakdown = (Map<String, Object>) atsResult.get("breakdown");
        @SuppressWarnings("unchecked")
        List<String> missingSkills = (List<String>) atsResult.get("missingSkills");
        @SuppressWarnings("unchecked")
        List<String> suggestions = (List<String>) atsResult.get("suggestions");

        // AI client enhancement
        try {
            Map<String, Object> aiAnalysis = aiFactory.getClient().analyzeResume(rawText, targetJobDescription);
            if (aiAnalysis != null) {
                if (aiAnalysis.containsKey("atsScore")) {
                    totalAtsScore = ((Number) aiAnalysis.get("atsScore")).doubleValue();
                }
                if (aiAnalysis.containsKey("identifiedMissingSkills")) {
                    @SuppressWarnings("unchecked")
                    List<String> aiMissing = (List<String>) aiAnalysis.get("identifiedMissingSkills");
                    if (aiMissing != null && !aiMissing.isEmpty()) {
                        missingSkills = aiMissing;
                    }
                }
                if (aiAnalysis.containsKey("improvementSuggestions")) {
                    @SuppressWarnings("unchecked")
                    List<String> aiSugg = (List<String>) aiAnalysis.get("improvementSuggestions");
                    if (aiSugg != null && !aiSugg.isEmpty()) {
                        suggestions = aiSugg;
                    }
                }
                if (aiAnalysis.containsKey("professionalSummary") && aiAnalysis.get("professionalSummary") != null) {
                    localData.put("professionalSummary", aiAnalysis.get("professionalSummary"));
                }
            }
        } catch (Exception e) {
            logger.warn("AI resume enhancement warning (fallback heuristic retained): {}", e.getMessage());
        }

        Resume resume = new Resume();
        resume.setUserId(userId);
        resume.setFileName(filename);
        resume.setFileType(file.getContentType());
        resume.setFileSize(file.getSize());
        resume.setRawText(rawText);
        resume.setCandidateName((String) localData.get("candidateName"));
        resume.setCandidateEmail((String) localData.get("candidateEmail"));
        resume.setCandidatePhone((String) localData.get("candidatePhone"));
        resume.setProfessionalSummary((String) localData.get("professionalSummary"));

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> education = (List<Map<String, Object>>) localData.get("education");
        resume.setEducation(education != null ? education : new ArrayList<>());

        resume.setTechnicalSkills(extractedSkills);

        @SuppressWarnings("unchecked")
        List<String> softSkills = (List<String>) localData.get("softSkills");
        resume.setSoftSkills(softSkills != null ? softSkills : new ArrayList<>());

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> projects = (List<Map<String, Object>>) localData.get("projects");
        resume.setProjects(projects != null ? projects : new ArrayList<>());

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> work = (List<Map<String, Object>>) localData.get("workExperience");
        resume.setWorkExperience(work != null ? work : new ArrayList<>());

        @SuppressWarnings("unchecked")
        List<String> certs = (List<String>) localData.get("certifications");
        resume.setCertifications(certs != null ? certs : new ArrayList<>());

        resume.setAtsScore(Math.round(totalAtsScore * 10.0) / 10.0);
        resume.setAtsScoreBreakdown(atsBreakdown);
        resume.setIdentifiedMissingSkills(missingSkills);
        resume.setImprovementSuggestions(suggestions);
        resume.setTargetJobDescription(targetJobDescription);
        resume.setUploadedAt(Instant.now());
        resume.setAnalyzedAt(Instant.now());

        Resume saved = resumeRepository.save(resume);
        return toDto(saved);
    }

    public List<ResumeDTOs.ResumeUploadResponse> getUserResumes(String userId) {
        return resumeRepository.findByUserIdOrderByUploadedAtDesc(userId).stream()
                .map(this::toDto)
                .toList();
    }

    public ResumeDTOs.ResumeUploadResponse getResumeById(String id, String userId) {
        Resume resume = resumeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
        return toDto(resume);
    }

    public ResumeDTOs.ResumeUploadResponse updateResume(String id, String userId, ResumeDTOs.ResumeUpdateRequest request) {
        Resume resume = resumeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));

        if (request.getCandidateName() != null) resume.setCandidateName(request.getCandidateName());
        if (request.getCandidateEmail() != null) resume.setCandidateEmail(request.getCandidateEmail());
        if (request.getCandidatePhone() != null) resume.setCandidatePhone(request.getCandidatePhone());
        if (request.getProfessionalSummary() != null) resume.setProfessionalSummary(request.getProfessionalSummary());
        if (request.getEducation() != null) resume.setEducation(request.getEducation());
        if (request.getTechnicalSkills() != null) resume.setTechnicalSkills(request.getTechnicalSkills());
        if (request.getSoftSkills() != null) resume.setSoftSkills(request.getSoftSkills());
        if (request.getProjects() != null) resume.setProjects(request.getProjects());
        if (request.getWorkExperience() != null) resume.setWorkExperience(request.getWorkExperience());
        if (request.getCertifications() != null) resume.setCertifications(request.getCertifications());
        if (request.getTargetJobDescription() != null) resume.setTargetJobDescription(request.getTargetJobDescription());

        // Re-evaluate ATS with updated skills and JD
        Map<String, Object> atsResult = atsEvaluator.evaluateAts(resume.getRawText(), resume.getTargetJobDescription(), resume.getTechnicalSkills());
        resume.setAtsScore(((Number) atsResult.get("totalScore")).doubleValue());
        @SuppressWarnings("unchecked")
        Map<String, Object> breakdown = (Map<String, Object>) atsResult.get("breakdown");
        resume.setAtsScoreBreakdown(breakdown);
        @SuppressWarnings("unchecked")
        List<String> missing = (List<String>) atsResult.get("missingSkills");
        resume.setIdentifiedMissingSkills(missing);
        @SuppressWarnings("unchecked")
        List<String> sugg = (List<String>) atsResult.get("suggestions");
        resume.setImprovementSuggestions(sugg);
        resume.setAnalyzedAt(Instant.now());

        Resume saved = resumeRepository.save(resume);
        return toDto(saved);
    }

    public void deleteResume(String id, String userId) {
        Resume resume = resumeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
        resumeRepository.delete(resume);
    }

    public ResumeDTOs.ResumeUploadResponse reanalyzeResume(String id, String userId, String jobDescription) {
        Resume resume = resumeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));

        resume.setTargetJobDescription(jobDescription);
        Map<String, Object> atsResult = atsEvaluator.evaluateAts(resume.getRawText(), jobDescription, resume.getTechnicalSkills());
        resume.setAtsScore(((Number) atsResult.get("totalScore")).doubleValue());
        @SuppressWarnings("unchecked")
        Map<String, Object> breakdown = (Map<String, Object>) atsResult.get("breakdown");
        resume.setAtsScoreBreakdown(breakdown);
        @SuppressWarnings("unchecked")
        List<String> missing = (List<String>) atsResult.get("missingSkills");
        resume.setIdentifiedMissingSkills(missing);
        @SuppressWarnings("unchecked")
        List<String> sugg = (List<String>) atsResult.get("suggestions");
        resume.setImprovementSuggestions(sugg);
        resume.setAnalyzedAt(Instant.now());

        Resume saved = resumeRepository.save(resume);
        return toDto(saved);
    }

    private ResumeDTOs.ResumeUploadResponse toDto(Resume r) {
        ResumeDTOs.ResumeUploadResponse dto = new ResumeDTOs.ResumeUploadResponse();
        dto.setId(r.getId());
        dto.setFileName(r.getFileName());
        dto.setFileType(r.getFileType());
        dto.setFileSize(r.getFileSize());
        dto.setCandidateName(r.getCandidateName());
        dto.setCandidateEmail(r.getCandidateEmail());
        dto.setCandidatePhone(r.getCandidatePhone());
        dto.setProfessionalSummary(r.getProfessionalSummary());
        dto.setEducation(r.getEducation());
        dto.setTechnicalSkills(r.getTechnicalSkills());
        dto.setSoftSkills(r.getSoftSkills());
        dto.setProjects(r.getProjects());
        dto.setWorkExperience(r.getWorkExperience());
        dto.setCertifications(r.getCertifications());
        dto.setAtsScore(r.getAtsScore());
        dto.setAtsScoreBreakdown(r.getAtsScoreBreakdown());
        dto.setIdentifiedMissingSkills(r.getIdentifiedMissingSkills());
        dto.setImprovementSuggestions(r.getImprovementSuggestions());
        dto.setTargetJobDescription(r.getTargetJobDescription());
        dto.setUploadedAt(r.getUploadedAt());
        dto.setAnalyzedAt(r.getAnalyzedAt());
        return dto;
    }
}
