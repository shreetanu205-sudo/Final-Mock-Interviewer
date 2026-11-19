package com.preporbit.dto;

import com.preporbit.model.Question;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public class InterviewDTOs {

    public static class CreateInterviewRequest {
        @NotBlank(message = "Job role is required")
        private String jobRole;

        @NotEmpty(message = "At least one skill must be selected")
        private List<String> targetSkills;

        private String difficulty = "Intermediate"; // Beginner, Intermediate, Advanced
        private String category = "Mixed"; // Technical, HR, Behavioral, Project-based, Mixed
        private String mode = "text"; // text, voice

        @Min(value = 5, message = "Minimum 5 questions")
        @Max(value = 25, message = "Maximum 25 questions")
        private int totalQuestions = 15; // 10, 15, 20

        private String resumeId;

        public String getJobRole() {
            return jobRole;
        }

        public void setJobRole(String jobRole) {
            this.jobRole = jobRole;
        }

        public List<String> getTargetSkills() {
            return targetSkills;
        }

        public void setTargetSkills(List<String> targetSkills) {
            this.targetSkills = targetSkills;
        }

        public String getDifficulty() {
            return difficulty;
        }

        public void setDifficulty(String difficulty) {
            this.difficulty = difficulty;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getMode() {
            return mode;
        }

        public void setMode(String mode) {
            this.mode = mode;
        }

        public int getTotalQuestions() {
            return totalQuestions;
        }

        public void setTotalQuestions(int totalQuestions) {
            this.totalQuestions = totalQuestions;
        }

        public String getResumeId() {
            return resumeId;
        }

        public void setResumeId(String resumeId) {
            this.resumeId = resumeId;
        }
    }

    public static class InterviewSummaryResponse {
        private String id;
        private String jobRole;
        private List<String> targetSkills;
        private String difficulty;
        private String category;
        private String mode;
        private int totalQuestions;
        private int totalBatches;
        private int currentBatchNumber;
        private String status;
        private double overallScore;
        private Instant createdAt;
        private Instant completedAt;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getJobRole() {
            return jobRole;
        }

        public void setJobRole(String jobRole) {
            this.jobRole = jobRole;
        }

        public List<String> getTargetSkills() {
            return targetSkills;
        }

        public void setTargetSkills(List<String> targetSkills) {
            this.targetSkills = targetSkills;
        }

        public String getDifficulty() {
            return difficulty;
        }

        public void setDifficulty(String difficulty) {
            this.difficulty = difficulty;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getMode() {
            return mode;
        }

        public void setMode(String mode) {
            this.mode = mode;
        }

        public int getTotalQuestions() {
            return totalQuestions;
        }

        public void setTotalQuestions(int totalQuestions) {
            this.totalQuestions = totalQuestions;
        }

        public int getTotalBatches() {
            return totalBatches;
        }

        public void setTotalBatches(int totalBatches) {
            this.totalBatches = totalBatches;
        }

        public int getCurrentBatchNumber() {
            return currentBatchNumber;
        }

        public void setCurrentBatchNumber(int currentBatchNumber) {
            this.currentBatchNumber = currentBatchNumber;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public double getOverallScore() {
            return overallScore;
        }

        public void setOverallScore(double overallScore) {
            this.overallScore = overallScore;
        }

        public Instant getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Instant createdAt) {
            this.createdAt = createdAt;
        }

        public Instant getCompletedAt() {
            return completedAt;
        }

        public void setCompletedAt(Instant completedAt) {
            this.completedAt = completedAt;
        }
    }

    public static class BatchResponse {
        private String batchId;
        private String interviewId;
        private int batchNumber;
        private int totalBatches;
        private List<Question> questions;
        private boolean isSubmitted;
        private double batchScore;
        private String batchSummary;

        public String getBatchId() {
            return batchId;
        }

        public void setBatchId(String batchId) {
            this.batchId = batchId;
        }

        public String getInterviewId() {
            return interviewId;
        }

        public void setInterviewId(String interviewId) {
            this.interviewId = interviewId;
        }

        public int getBatchNumber() {
            return batchNumber;
        }

        public void setBatchNumber(int batchNumber) {
            this.batchNumber = batchNumber;
        }

        public int getTotalBatches() {
            return totalBatches;
        }

        public void setTotalBatches(int totalBatches) {
            this.totalBatches = totalBatches;
        }

        public List<Question> getQuestions() {
            return questions;
        }

        public void setQuestions(List<Question> questions) {
            this.questions = questions;
        }

        public boolean isSubmitted() {
            return isSubmitted;
        }

        public void setSubmitted(boolean submitted) {
            isSubmitted = submitted;
        }

        public double getBatchScore() {
            return batchScore;
        }

        public void setBatchScore(double batchScore) {
            this.batchScore = batchScore;
        }

        public String getBatchSummary() {
            return batchSummary;
        }

        public void setBatchSummary(String batchSummary) {
            this.batchSummary = batchSummary;
        }
    }

    public static class QuestionAnswerSubmit {
        private String questionId;
        private String questionText;
        private String answer;
        private boolean isSkipped;
        private Map<String, Object> audioMetadata;

        public String getQuestionId() {
            return questionId;
        }

        public void setQuestionId(String questionId) {
            this.questionId = questionId;
        }

        public String getQuestionText() {
            return questionText;
        }

        public void setQuestionText(String questionText) {
            this.questionText = questionText;
        }

        public String getAnswer() {
            return answer;
        }

        public void setAnswer(String answer) {
            this.answer = answer;
        }

        public boolean isSkipped() {
            return isSkipped;
        }

        public void setSkipped(boolean skipped) {
            isSkipped = skipped;
        }

        public Map<String, Object> getAudioMetadata() {
            return audioMetadata;
        }

        public void setAudioMetadata(Map<String, Object> audioMetadata) {
            this.audioMetadata = audioMetadata;
        }
    }

    public static class SubmitBatchRequest {
        private int batchNumber;
        private List<QuestionAnswerSubmit> answers;

        public int getBatchNumber() {
            return batchNumber;
        }

        public void setBatchNumber(int batchNumber) {
            this.batchNumber = batchNumber;
        }

        public List<QuestionAnswerSubmit> getAnswers() {
            return answers;
        }

        public void setAnswers(List<QuestionAnswerSubmit> answers) {
            this.answers = answers;
        }
    }

    public static class BatchEvaluationResponse {
        private String interviewId;
        private int batchNumber;
        private int totalBatches;
        private double batchScore;
        private String batchSummary;
        private List<Map<String, Object>> evaluations;
        private boolean isInterviewComplete;
        private boolean nextBatchAvailable;
        private double runningOverallScore;

        public String getInterviewId() {
            return interviewId;
        }

        public void setInterviewId(String interviewId) {
            this.interviewId = interviewId;
        }

        public int getBatchNumber() {
            return batchNumber;
        }

        public void setBatchNumber(int batchNumber) {
            this.batchNumber = batchNumber;
        }

        public int getTotalBatches() {
            return totalBatches;
        }

        public void setTotalBatches(int totalBatches) {
            this.totalBatches = totalBatches;
        }

        public double getBatchScore() {
            return batchScore;
        }

        public void setBatchScore(double batchScore) {
            this.batchScore = batchScore;
        }

        public String getBatchSummary() {
            return batchSummary;
        }

        public void setBatchSummary(String batchSummary) {
            this.batchSummary = batchSummary;
        }

        public List<Map<String, Object>> getEvaluations() {
            return evaluations;
        }

        public void setEvaluations(List<Map<String, Object>> evaluations) {
            this.evaluations = evaluations;
        }

        public boolean isInterviewComplete() {
            return isInterviewComplete;
        }

        public void setInterviewComplete(boolean interviewComplete) {
            isInterviewComplete = interviewComplete;
        }

        public boolean isNextBatchAvailable() {
            return nextBatchAvailable;
        }

        public void setNextBatchAvailable(boolean nextBatchAvailable) {
            this.nextBatchAvailable = nextBatchAvailable;
        }

        public double getRunningOverallScore() {
            return runningOverallScore;
        }

        public void setRunningOverallScore(double runningOverallScore) {
            this.runningOverallScore = runningOverallScore;
        }
    }
}
