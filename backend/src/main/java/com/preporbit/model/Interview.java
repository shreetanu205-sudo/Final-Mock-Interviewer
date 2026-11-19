package com.preporbit.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "interviews")
public class Interview {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String resumeId;

    private String jobRole;

    private List<String> targetSkills = new ArrayList<>();

    private String difficulty; // Beginner, Intermediate, Advanced

    private String category; // Technical, HR, Behavioral, Project-based, Mixed

    private String mode; // text, voice

    private int totalQuestions; // 10, 15, 20

    private int totalBatches; // 2, 3, 4

    private int currentBatchNumber = 1;

    private String status = "CREATED"; // CREATED, IN_PROGRESS, COMPLETED, ABANDONED

    private double overallScore;

    private Instant createdAt = Instant.now();

    private Instant completedAt;

    public Interview() {
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

    public String getResumeId() {
        return resumeId;
    }

    public void setResumeId(String resumeId) {
        this.resumeId = resumeId;
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
        this.totalBatches = (int) Math.ceil((double) totalQuestions / 5.0);
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
