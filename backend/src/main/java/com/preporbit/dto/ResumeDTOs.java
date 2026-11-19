package com.preporbit.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public class ResumeDTOs {

    public static class ResumeUploadResponse {
        private String id;
        private String fileName;
        private String fileType;
        private long fileSize;
        private String candidateName;
        private String candidateEmail;
        private String candidatePhone;
        private String professionalSummary;
        private List<Map<String, Object>> education;
        private List<String> technicalSkills;
        private List<String> softSkills;
        private List<Map<String, Object>> projects;
        private List<Map<String, Object>> workExperience;
        private List<String> certifications;
        private double atsScore;
        private Map<String, Object> atsScoreBreakdown;
        private List<String> identifiedMissingSkills;
        private List<String> improvementSuggestions;
        private String targetJobDescription;
        private Instant uploadedAt;
        private Instant analyzedAt;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
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

    public static class ResumeUpdateRequest {
        private String candidateName;
        private String candidateEmail;
        private String candidatePhone;
        private String professionalSummary;
        private List<Map<String, Object>> education;
        private List<String> technicalSkills;
        private List<String> softSkills;
        private List<Map<String, Object>> projects;
        private List<Map<String, Object>> workExperience;
        private List<String> certifications;
        private String targetJobDescription;

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

        public String getTargetJobDescription() {
            return targetJobDescription;
        }

        public void setTargetJobDescription(String targetJobDescription) {
            this.targetJobDescription = targetJobDescription;
        }
    }
}
