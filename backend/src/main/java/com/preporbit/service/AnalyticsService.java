package com.preporbit.service;

import com.preporbit.dto.AnalyticsDTOs;
import com.preporbit.dto.InterviewDTOs;
import com.preporbit.model.Interview;
import com.preporbit.model.Report;
import com.preporbit.model.Resume;
import com.preporbit.repository.InterviewRepository;
import com.preporbit.repository.ReportRepository;
import com.preporbit.repository.ResumeRepository;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class AnalyticsService {

    private final InterviewRepository interviewRepository;
    private final ReportRepository reportRepository;
    private final ResumeRepository resumeRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM dd").withZone(ZoneId.systemDefault());

    public AnalyticsService(InterviewRepository interviewRepository, ReportRepository reportRepository, ResumeRepository resumeRepository) {
        this.interviewRepository = interviewRepository;
        this.reportRepository = reportRepository;
        this.resumeRepository = resumeRepository;
    }

    public AnalyticsDTOs.DashboardStatsResponse getDashboardStats(String userId) {
        AnalyticsDTOs.DashboardStatsResponse stats = new AnalyticsDTOs.DashboardStatsResponse();

        List<Interview> completedInterviews = interviewRepository.findByUserIdAndStatusOrderByCompletedAtDesc(userId, "COMPLETED");
        List<Interview> allInterviews = interviewRepository.findByUserIdOrderByCreatedAtDesc(userId);

        stats.setTotalInterviews(completedInterviews.size());

        double avgScore = 0.0;
        if (!completedInterviews.isEmpty()) {
            double sum = completedInterviews.stream().mapToDouble(Interview::getOverallScore).sum();
            avgScore = Math.round((sum / completedInterviews.size()) * 10.0) / 10.0;
        }
        stats.setAverageInterviewScore(avgScore);

        // Resume info
        Optional<Resume> latestResume = resumeRepository.findFirstByUserIdOrderByUploadedAtDesc(userId);
        if (latestResume.isPresent()) {
            stats.setCurrentAtsScore(latestResume.get().getAtsScore());
            stats.setResumeFileName(latestResume.get().getFileName());
            stats.setResumeUploadedAt(latestResume.get().getUploadedAt());
        }

        // Score trend history (chronological order)
        List<AnalyticsDTOs.ScoreHistoryPoint> history = new ArrayList<>();
        List<Interview> chronological = new ArrayList<>(completedInterviews);
        Collections.reverse(chronological);

        for (Interview i : chronological) {
            String dateStr = i.getCompletedAt() != null ? DATE_FORMATTER.format(i.getCompletedAt()) : "Recent";
            history.add(new AnalyticsDTOs.ScoreHistoryPoint(
                    i.getId(),
                    dateStr,
                    i.getJobRole(),
                    i.getOverallScore(),
                    i.getDifficulty()
            ));
        }
        stats.setScoreHistory(history);

        // Aggregate skill performance across reports
        List<Report> reports = reportRepository.findByUserIdOrderByGeneratedAtDesc(userId);
        Map<String, List<Double>> skillMap = new HashMap<>();
        Set<String> weaknesses = new LinkedHashSet<>();

        for (Report r : reports) {
            if (r.getWeakestAreas() != null) {
                weaknesses.addAll(r.getWeakestAreas());
            }
            if (r.getSkillScores() != null) {
                for (Map<String, Object> sk : r.getSkillScores()) {
                    String name = (String) sk.get("skill");
                    Object sc = sk.get("score");
                    if (name != null && sc instanceof Number) {
                        skillMap.computeIfAbsent(name, k -> new ArrayList<>()).add(((Number) sc).doubleValue());
                    }
                }
            }
        }

        List<Map<String, Object>> skillPerformance = new ArrayList<>();
        for (Map.Entry<String, List<Double>> entry : skillMap.entrySet()) {
            double avg = entry.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
            Map<String, Object> item = new HashMap<>();
            item.put("skill", entry.getKey());
            item.put("averageScore", Math.round(avg * 10.0) / 10.0);
            item.put("sessionsCount", entry.getValue().size());
            skillPerformance.add(item);
        }
        skillPerformance.sort((a, b) -> Double.compare(((Number) b.get("averageScore")).doubleValue(), ((Number) a.get("averageScore")).doubleValue()));
        stats.setSkillPerformance(skillPerformance);

        if (weaknesses.isEmpty()) {
            weaknesses.add("Practice more system architecture trade-offs");
            weaknesses.add("Elaborate on edge-case error recovery");
        }
        stats.setAreasRequiringImprovement(new ArrayList<>(weaknesses));

        // Recent 5 interviews
        List<InterviewDTOs.InterviewSummaryResponse> recentList = allInterviews.stream().limit(5).map(i -> {
            InterviewDTOs.InterviewSummaryResponse dto = new InterviewDTOs.InterviewSummaryResponse();
            dto.setId(i.getId());
            dto.setJobRole(i.getJobRole());
            dto.setTargetSkills(i.getTargetSkills());
            dto.setDifficulty(i.getDifficulty());
            dto.setCategory(i.getCategory());
            dto.setMode(i.getMode());
            dto.setTotalQuestions(i.getTotalQuestions());
            dto.setTotalBatches(i.getTotalBatches());
            dto.setCurrentBatchNumber(i.getCurrentBatchNumber());
            dto.setStatus(i.getStatus());
            dto.setOverallScore(i.getOverallScore());
            dto.setCreatedAt(i.getCreatedAt());
            dto.setCompletedAt(i.getCompletedAt());
            return dto;
        }).toList();
        stats.setRecentInterviews(recentList);

        return stats;
    }
}
