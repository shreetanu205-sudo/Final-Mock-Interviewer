package com.preporbit.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "question_batches")
public class QuestionBatch {

    @Id
    private String id;

    @Indexed
    private String interviewId;

    private int batchNumber;

    private List<Question> questions = new ArrayList<>();

    private boolean isSubmitted = false;

    private double batchScore;

    private String batchSummary;

    private Instant createdAt = Instant.now();

    private Instant submittedAt;

    public QuestionBatch() {
    }

    public QuestionBatch(String interviewId, int batchNumber, List<Question> questions) {
        this.interviewId = interviewId;
        this.batchNumber = batchNumber;
        this.questions = questions;
        this.createdAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Instant submittedAt) {
        this.submittedAt = submittedAt;
    }
}
