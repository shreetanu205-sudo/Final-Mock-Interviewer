package com.preporbit.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public class AnalyticsDTOs {

    public static class ScoreHistoryPoint {
        private String interviewId;
        private String date;
        private String role;
        private double score;
        private String difficulty;

        public ScoreHistoryPoint() {
        }

        public ScoreHistoryPoint(String interviewId, String date, String role, double score, String difficulty) {
            this.interviewId = interviewId;
            this.date = date;
            this.role = role;
            this.score = score;
            this.difficulty = difficulty;
        }

        public String getInterviewId() {
            return interviewId;
        }

        public void setInterviewId(String interviewId) {
            this.interviewId = interviewId;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public double getScore() {
            return score;
        }

        public void setScore(double score) {
            this.score = score;
        }

        public String getDifficulty() {
            return difficulty;
        }

        public void setDifficulty(String difficulty) {
            this.difficulty = difficulty;
        }
    }

    public static class DashboardStatsResponse {
        private long totalInterviews;
        private double averageInterviewScore;
        private Double currentAtsScore;
        private String resumeFileName;
        private Instant resumeUploadedAt;
        private List<ScoreHistoryPoint> scoreHistory;
        private List<Map<String, Object>> skillPerformance;
        private List<String> areasRequiringImprovement;
        private List<InterviewDTOs.InterviewSummaryResponse> recentInterviews;

        public long getTotalInterviews() {
            return totalInterviews;
        }

        public void setTotalInterviews(long totalInterviews) {
            this.totalInterviews = totalInterviews;
        }

        public double getAverageInterviewScore() {
            return averageInterviewScore;
        }

        public void setAverageInterviewScore(double averageInterviewScore) {
            this.averageInterviewScore = averageInterviewScore;
        }

        public Double getCurrentAtsScore() {
            return currentAtsScore;
        }

        public void setCurrentAtsScore(Double currentAtsScore) {
            this.currentAtsScore = currentAtsScore;
        }

        public String getResumeFileName() {
            return resumeFileName;
        }

        public void setResumeFileName(String resumeFileName) {
            this.resumeFileName = resumeFileName;
        }

        public Instant getResumeUploadedAt() {
            return resumeUploadedAt;
        }

        public void setResumeUploadedAt(Instant resumeUploadedAt) {
            this.resumeUploadedAt = resumeUploadedAt;
        }

        public List<ScoreHistoryPoint> getScoreHistory() {
            return scoreHistory;
        }

        public void setScoreHistory(List<ScoreHistoryPoint> scoreHistory) {
            this.scoreHistory = scoreHistory;
        }

        public List<Map<String, Object>> getSkillPerformance() {
            return skillPerformance;
        }

        public void setSkillPerformance(List<Map<String, Object>> skillPerformance) {
            this.skillPerformance = skillPerformance;
        }

        public List<String> getAreasRequiringImprovement() {
            return areasRequiringImprovement;
        }

        public void setAreasRequiringImprovement(List<String> areasRequiringImprovement) {
            this.areasRequiringImprovement = areasRequiringImprovement;
        }

        public List<InterviewDTOs.InterviewSummaryResponse> getRecentInterviews() {
            return recentInterviews;
        }

        public void setRecentInterviews(List<InterviewDTOs.InterviewSummaryResponse> recentInterviews) {
            this.recentInterviews = recentInterviews;
        }
    }
}
