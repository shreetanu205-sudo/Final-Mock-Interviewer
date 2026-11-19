package com.preporbit.resume;

import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class AtsEvaluator {

    private static final List<String> COMMON_TECH_KEYWORDS = Arrays.asList(
            "java", "python", "javascript", "typescript", "react", "angular", "vue", "spring", "spring boot",
            "node.js", "express", "sql", "mysql", "postgresql", "mongodb", "redis", "docker", "kubernetes",
            "aws", "azure", "gcp", "git", "github", "ci/cd", "rest", "api", "microservices", "html", "css",
            "tailwind", "data structures", "algorithms", "oop", "junit", "maven", "gradle", "linux"
    );

    private static final List<String> ACTION_VERBS = Arrays.asList(
            "developed", "designed", "implemented", "built", "created", "architected", "optimized",
            "improved", "reduced", "increased", "deployed", "managed", "led", "engineered", "collaborated"
    );

    private static final List<String> STANDARD_SECTIONS = Arrays.asList(
            "education", "experience", "work experience", "skills", "projects", "certifications", "summary", "objective"
    );

    public Map<String, Object> evaluateAts(String resumeText, String jobDescription, List<String> extractedSkills) {
        String lowerResume = (resumeText != null ? resumeText.toLowerCase() : "");
        String lowerJd = (jobDescription != null ? jobDescription.toLowerCase() : "");

        // 1. Structure & Formatting Score (Max 25)
        int structureScore = 0;
        int foundSections = 0;
        for (String section : STANDARD_SECTIONS) {
            if (lowerResume.contains(section)) {
                foundSections++;
            }
        }
        structureScore = Math.min(25, (int) Math.round((foundSections / 4.0) * 25));

        // 2. Contact Info & Professional Formatting (Max 15)
        int contactScore = 0;
        boolean hasEmail = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}").matcher(lowerResume).find();
        boolean hasPhone = Pattern.compile("(\\+?\\d{1,3}[- ]?)?\\(?\\d{3}\\)?[- ]?\\d{3}[- ]?\\d{4}").matcher(lowerResume).find();
        if (hasEmail) contactScore += 8;
        if (hasPhone) contactScore += 7;

        // 3. Action Verbs & Measurable Impact (Max 25)
        int impactScore = 0;
        int verbCount = 0;
        for (String verb : ACTION_VERBS) {
            if (lowerResume.contains(verb)) {
                verbCount++;
            }
        }
        impactScore += Math.min(15, verbCount * 2);

        // Check for numbers, metrics, percentages (e.g. 20%, 5x, $10k, 100+)
        Matcher metricMatcher = Pattern.compile("\\b(\\d+%|\\d+x|\\$\\d+|\\d+\\+)\\b").matcher(lowerResume);
        int metricCount = 0;
        while (metricMatcher.find()) {
            metricCount++;
        }
        impactScore += Math.min(10, metricCount * 2);

        // 4. Skills & Keyword Alignment (Max 35)
        int keywordScore = 0;
        List<String> missingCriticalSkills = new ArrayList<>();
        List<String> matchedSkills = new ArrayList<>();

        if (!lowerJd.trim().isEmpty()) {
            // Match against JD
            for (String kw : COMMON_TECH_KEYWORDS) {
                if (lowerJd.contains(kw)) {
                    if (lowerResume.contains(kw)) {
                        matchedSkills.add(kw);
                    } else {
                        missingCriticalSkills.add(kw);
                    }
                }
            }
            int totalJdKeywords = matchedSkills.size() + missingCriticalSkills.size();
            if (totalJdKeywords > 0) {
                keywordScore = (int) Math.round(((double) matchedSkills.size() / totalJdKeywords) * 35.0);
            } else {
                keywordScore = 25;
            }
        } else {
            // General tech keyword density
            for (String kw : COMMON_TECH_KEYWORDS) {
                if (lowerResume.contains(kw)) {
                    matchedSkills.add(kw);
                }
            }
            keywordScore = Math.min(35, (int) Math.round((matchedSkills.size() / 12.0) * 35));
            if (matchedSkills.size() < 6) {
                missingCriticalSkills.addAll(Arrays.asList("Git", "Docker", "CI/CD", "Unit Testing", "REST API"));
            }
        }

        double totalScore = Math.min(98.0, Math.max(35.0, structureScore + contactScore + impactScore + keywordScore));

        List<String> suggestions = new ArrayList<>();
        if (metricCount < 2) {
            suggestions.add("Add measurable metrics (e.g., 'improved API throughput by 30%', 'reduced latency to under 200ms') to demonstrate tangible project results.");
        }
        if (verbCount < 4) {
            suggestions.add("Begin bullet points with strong active action verbs (e.g., 'Architected', 'Engineered', 'Optimized', 'Refactored').");
        }
        if (foundSections < 4) {
            suggestions.add("Ensure clear standard section headers: 'Summary', 'Education', 'Technical Skills', 'Projects', and 'Work Experience'.");
        }
        if (!missingCriticalSkills.isEmpty()) {
            suggestions.add("Consider incorporating relevant skills aligned with target roles, such as: " + String.join(", ", missingCriticalSkills.subList(0, Math.min(4, missingCriticalSkills.size()))) + ".");
        }
        if (suggestions.isEmpty()) {
            suggestions.add("Resume demonstrates high ATS keyword alignment and strong structural presentation.");
        }

        Map<String, Object> breakdown = new HashMap<>();
        breakdown.put("structureScore", structureScore);
        breakdown.put("contactScore", contactScore);
        breakdown.put("impactScore", impactScore);
        breakdown.put("keywordScore", keywordScore);
        breakdown.put("matchedKeywordsCount", matchedSkills.size());

        Map<String, Object> result = new HashMap<>();
        result.put("totalScore", totalScore);
        result.put("breakdown", breakdown);
        result.put("missingSkills", missingCriticalSkills);
        result.put("suggestions", suggestions);

        return result;
    }
}
