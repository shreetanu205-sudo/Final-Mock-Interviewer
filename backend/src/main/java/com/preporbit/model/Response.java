package com.preporbit.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "responses")
public class Response {

    @Id
    private String id;

    @Indexed
    private String interviewId;

    @Indexed
    private String batchId;

    private int batchNumber;

    private String questionId;

    private String questionText;

    private String candidateAnswer;

    private boolean isSkipped;

    private double score;

    private Map<String, Double> rubricScores = new HashMap<>();

    private String whatWasDoneWell;

    private List<String> missingConcepts = new ArrayList<>();

    private String areasForImprovement;

    private String suggestedBetterAnswer;

    private Map<String, Object> audioMetadata = new HashMap<>();

    private Instant answeredAt = Instant.now();

    public Response() {
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

    public String getBatchId() {
        return batchId;
    }

    public void setBatchId(String batchId) {
        this.batchId = batchId;
    }

    public int getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(int batchNumber) {
        this.batchNumber = batchNumber;
    }

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

    public String getCandidateAnswer() {
        return candidateAnswer;
    }

    public void setCandidateAnswer(String candidateAnswer) {
        this.candidateAnswer = candidateAnswer;
    }

    public boolean isSkipped() {
        return isSkipped;
    }

    public void setSkipped(boolean skipped) {
        isSkipped = skipped;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public Map<String, Double> getRubricScores() {
        return rubricScores;
    }

    public void setRubricScores(Map<String, Double> rubricScores) {
        this.rubricScores = rubricScores;
    }

    public String getWhatWasDoneWell() {
        return whatWasDoneWell;
    }

    public void setWhatWasDoneWell(String whatWasDoneWell) {
        this.whatWasDoneWell = whatWasDoneWell;
    }

    public List<String> getMissingConcepts() {
        return missingConcepts;
    }

    public void setMissingConcepts(List<String> missingConcepts) {
        this.missingConcepts = missingConcepts;
    }

    public String getAreasForImprovement() {
        return areasForImprovement;
    }

    public void setAreasForImprovement(String areasForImprovement) {
        this.areasForImprovement = areasForImprovement;
    }

    public String getSuggestedBetterAnswer() {
        return suggestedBetterAnswer;
    }

    public void setSuggestedBetterAnswer(String suggestedBetterAnswer) {
        this.suggestedBetterAnswer = suggestedBetterAnswer;
    }

    public Map<String, Object> getAudioMetadata() {
        return audioMetadata;
    }

    public void setAudioMetadata(Map<String, Object> audioMetadata) {
        this.audioMetadata = audioMetadata;
    }

    public Instant getAnsweredAt() {
        return answeredAt;
    }

    public void setAnsweredAt(Instant answeredAt) {
        this.answeredAt = answeredAt;
    }
}
