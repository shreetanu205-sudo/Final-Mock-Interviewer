package com.preporbit.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public class ReportDTOs {

    public static class ReportResponse {
        private String id;
        private String interviewId;
        private String userId;
        private String jobRole;
        private String difficulty;
        private List<String> targetSkills;
        private double overallScore;
        private String readinessTier;
        private int totalQuestions;
        private int attemptedQuestions;
        private int skippedQuestions;
        private String executiveSummary;
        private List<Map<String, Object>> skillScores;
        private List<String> strongestAreas;
        private List<String> weakestAreas;
        private List<String> missingTechnicalConcepts;
        private List<Map<String, Object>> actionableImprovementPlan;
        private List<Map<String, Object>> recommendedStudyTopics;
        private List<Map<String, Object>> questionEvaluations;
        private Instant generatedAt;

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

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getJobRole() {
            return jobRole;
        }

        public void setJobRole(String jobRole) {
            this.jobRole = jobRole;
        }

        public String getDifficulty() {
            return difficulty;
        }

        public void setDifficulty(String difficulty) {
            this.difficulty = difficulty;
        }

        public List<String> getTargetSkills() {
            return targetSkills;
        }

        public void setTargetSkills(List<String> targetSkills) {
            this.targetSkills = targetSkills;
        }

        public double getOverallScore() {
            return overallScore;
        }

        public void setOverallScore(double overallScore) {
            this.overallScore = overallScore;
        }

        public String getReadinessTier() {
            return readinessTier;
        }

        public void setReadinessTier(String readinessTier) {
            this.readinessTier = readinessTier;
        }

        public int getTotalQuestions() {
            return totalQuestions;
        }

        public void setTotalQuestions(int totalQuestions) {
            this.totalQuestions = totalQuestions;
        }

        public int getAttemptedQuestions() {
            return attemptedQuestions;
        }

        public void setAttemptedQuestions(int attemptedQuestions) {
            this.attemptedQuestions = attemptedQuestions;
        }

        public int getSkippedQuestions() {
            return skippedQuestions;
        }

        public void setSkippedQuestions(int skippedQuestions) {
            this.skippedQuestions = skippedQuestions;
        }

        public String getExecutiveSummary() {
            return executiveSummary;
        }

        public void setExecutiveSummary(String executiveSummary) {
            this.executiveSummary = executiveSummary;
        }

        public List<Map<String, Object>> getSkillScores() {
            return skillScores;
        }

        public void setSkillScores(List<Map<String, Object>> skillScores) {
            this.skillScores = skillScores;
        }

        public List<String> getStrongestAreas() {
            return strongestAreas;
        }

        public void setStrongestAreas(List<String> strongestAreas) {
            this.strongestAreas = strongestAreas;
        }

        public List<String> getWeakestAreas() {
            return weakestAreas;
        }

        public void setWeakestAreas(List<String> weakestAreas) {
            this.weakestAreas = weakestAreas;
        }

        public List<String> getMissingTechnicalConcepts() {
            return missingTechnicalConcepts;
        }

        public void setMissingTechnicalConcepts(List<String> missingTechnicalConcepts) {
            this.missingTechnicalConcepts = missingTechnicalConcepts;
        }

        public List<Map<String, Object>> getActionableImprovementPlan() {
            return actionableImprovementPlan;
        }

        public void setActionableImprovementPlan(List<Map<String, Object>> actionableImprovementPlan) {
            this.actionableImprovementPlan = actionableImprovementPlan;
        }

        public List<Map<String, Object>> getRecommendedStudyTopics() {
            return recommendedStudyTopics;
        }

        public void setRecommendedStudyTopics(List<Map<String, Object>> recommendedStudyTopics) {
            this.recommendedStudyTopics = recommendedStudyTopics;
        }

        public List<Map<String, Object>> getQuestionEvaluations() {
            return questionEvaluations;
        }

        public void setQuestionEvaluations(List<Map<String, Object>> questionEvaluations) {
            this.questionEvaluations = questionEvaluations;
        }

        public Instant getGeneratedAt() {
            return generatedAt;
        }

        public void setGeneratedAt(Instant generatedAt) {
            this.generatedAt = generatedAt;
        }
    }
}
