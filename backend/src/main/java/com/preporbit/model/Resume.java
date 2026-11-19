package com.preporbit.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "resumes")
public class Resume {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String fileName;

    private String fileType;

    private long fileSize;

    private String rawText;

    private String candidateName;

    private String candidateEmail;

    private String candidatePhone;

    private String candidateLocation;

    private String professionalSummary;

    private List<Map<String, Object>> education = new ArrayList<>();

    private List<String> technicalSkills = new ArrayList<>();

    private List<String> softSkills = new ArrayList<>();

    private List<Map<String, Object>> projects = new ArrayList<>();

    private List<Map<String, Object>> workExperience = new ArrayList<>();

    private List<String> certifications = new ArrayList<>();

    private double atsScore;

    private Map<String, Object> atsScoreBreakdown = new HashMap<>();

    private List<String> identifiedMissingSkills = new ArrayList<>();

    private List<String> improvementSuggestions = new ArrayList<>();

    private String targetJobDescription;

    private Instant uploadedAt = Instant.now();

    private Instant analyzedAt;

    public Resume() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public long getFileSize() {
        return fileSize;
    }

    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }

    public String getRawText() {
        return rawText;
    }

    public void setRawText(String rawText) {
        this.rawText = rawText;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public void setCandidateEmail(String candidateEmail) {
        this.candidateEmail = candidateEmail;
    }

    public String getCandidatePhone() {
        return candidatePhone;
    }

    public void setCandidatePhone(String candidatePhone) {
        this.candidatePhone = candidatePhone;
    }

    public String getCandidateLocation() {
        return candidateLocation;
    }

    public void setCandidateLocation(String candidateLocation) {
        this.candidateLocation = candidateLocation;
    }

    public String getProfessionalSummary() {
        return professionalSummary;
    }

    public void setProfessionalSummary(String professionalSummary) {
        this.professionalSummary = professionalSummary;
    }

    public List<Map<String, Object>> getEducation() {
        return education;
    }

    public void setEducation(List<Map<String, Object>> education) {
        this.education = education;
    }

    public List<String> getTechnicalSkills() {
        return technicalSkills;
    }

    public void setTechnicalSkills(List<String> technicalSkills) {
        this.technicalSkills = technicalSkills;
    }

    public List<String> getSoftSkills() {
        return softSkills;
    }

    public void setSoftSkills(List<String> softSkills) {
        this.softSkills = softSkills;
    }

    public List<Map<String, Object>> getProjects() {
        return projects;
    }

    public void setProjects(List<Map<String, Object>> projects) {
        this.projects = projects;
    }

    public List<Map<String, Object>> getWorkExperience() {
        return workExperience;
    }

    public void setWorkExperience(List<Map<String, Object>> workExperience) {
        this.workExperience = workExperience;
    }

    public List<String> getCertifications() {
        return certifications;
    }

    public void setCertifications(List<String> certifications) {
        this.certifications = certifications;
    }

    public double getAtsScore() {
        return atsScore;
    }

    public void setAtsScore(double atsScore) {
        this.atsScore = atsScore;
    }

    public Map<String, Object> getAtsScoreBreakdown() {
        return atsScoreBreakdown;
    }

    public void setAtsScoreBreakdown(Map<String, Object> atsScoreBreakdown) {
        this.atsScoreBreakdown = atsScoreBreakdown;
    }

    public List<String> getIdentifiedMissingSkills() {
        return identifiedMissingSkills;
    }

    public void setIdentifiedMissingSkills(List<String> identifiedMissingSkills) {
        this.identifiedMissingSkills = identifiedMissingSkills;
    }

    public List<String> getImprovementSuggestions() {
        return improvementSuggestions;
    }

    public void setImprovementSuggestions(List<String> improvementSuggestions) {
        this.improvementSuggestions = improvementSuggestions;
    }

    public String getTargetJobDescription() {
        return targetJobDescription;
    }

    public void setTargetJobDescription(String targetJobDescription) {
        this.targetJobDescription = targetJobDescription;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(Instant uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public Instant getAnalyzedAt() {
        return analyzedAt;
    }

    public void setAnalyzedAt(Instant analyzedAt) {
        this.analyzedAt = analyzedAt;
    }
}
