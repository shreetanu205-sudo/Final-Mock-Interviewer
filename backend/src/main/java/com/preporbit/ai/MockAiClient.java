package com.preporbit.ai;

import com.preporbit.model.Question;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class MockAiClient implements AiClient {

    @Override
    public Map<String, Object> analyzeResume(String resumeText, String targetJobDescription) {
        Map<String, Object> result = new HashMap<>();
        result.put("candidateName", "Candidate");
        result.put("professionalSummary", "Driven software engineer candidate with demonstrated capability across full-stack systems and data structures.");
        result.put("technicalSkills", List.of("Java", "Spring Boot", "React", "MongoDB", "SQL", "Git", "REST APIs"));
        result.put("softSkills", List.of("Problem Solving", "Clear Communication", "Team Collaboration"));
        result.put("atsScore", 82.0);

        Map<String, Object> breakdown = new HashMap<>();
        breakdown.put("keywordMatch", 84);
        breakdown.put("formatAndStructure", 88);
        breakdown.put("skillsAlignment", 80);
        breakdown.put("experienceRelevance", 76);
        result.put("atsScoreBreakdown", breakdown);

        result.put("identifiedMissingSkills", List.of("Docker", "CI/CD Pipelines", "Redis Caching"));
        result.put("improvementSuggestions", List.of(
                "Include quantifiable business impact (e.g., 'reduced API response times by 35%').",
                "Highlight automated testing and continuous integration tools (JUnit, GitHub Actions).",
                "Ensure job role keywords are explicitly referenced in the professional summary."
        ));
        return result;
    }

    @Override
    public List<Question> generateQuestionBatch(
            int batchNumber,
            int totalBatches,
            String jobRole,
            List<String> skills,
            String difficulty,
            String category,
            String resumeContext,
            String previousBatchContext
    ) {
        List<Question> questions = new ArrayList<>();
        String primarySkill = (skills != null && !skills.isEmpty()) ? skills.get(0) : "Software Engineering";
        String secondarySkill = (skills != null && skills.size() > 1) ? skills.get(1) : "Database Management";

        int startNum = (batchNumber - 1) * 5 + 1;

        if (batchNumber == 1) {
            questions.add(new Question(
                    "q_" + batchNumber + "_1",
                    startNum,
                    "Can you walk me through the core architectural lifecycle and memory management principles in " + primarySkill + "?",
                    category,
                    "conceptual",
                    primarySkill,
                    difficulty,
                    "Candidate should explain memory regions, garbage collection or lifecycle hooks, and object lifecycle."
            ));
            questions.add(new Question(
                    "q_" + batchNumber + "_2",
                    startNum + 1,
                    "How do you design and structure RESTful APIs to ensure idempotency, backwards compatibility, and proper HTTP status code semantics?",
                    category,
                    "technical",
                    "REST Architecture",
                    difficulty,
                    "Look for proper usage of PUT vs PATCH, idempotency tokens, versioning via headers or URI, and status codes."
            ));
            questions.add(new Question(
                    "q_" + batchNumber + "_3",
                    startNum + 2,
                    "In a recent project you built, what was the most challenging technical decision you made regarding " + secondarySkill + ", and what trade-offs did you evaluate?",
                    category,
                    "project",
                    secondarySkill,
                    difficulty,
                    "Look for concrete trade-off analysis (e.g. read latency vs write throughput, schema flexibility vs data consistency)."
            ));
            questions.add(new Question(
                    "q_" + batchNumber + "_4",
                    startNum + 3,
                    "How would you detect, diagnose, and resolve a slow-running query or performance bottleneck in your persistence layer?",
                    category,
                    "problem-solving",
                    "Performance Tuning",
                    difficulty,
                    "Should mention indexing strategies, execution plan analysis (EXPLAIN), connection pooling, and caching."
            ));
            questions.add(new Question(
                    "q_" + batchNumber + "_5",
                    startNum + 4,
                    "Tell me about a time when a critical requirement changed shortly before a project deadline. How did you adapt and collaborate with your team?",
                    category,
                    "behavioral",
                    "Adaptability & Teamwork",
                    "easy",
                    "Look for structured STAR technique (Situation, Task, Action, Result) with constructive communication."
            ));
        } else if (batchNumber == 2) {
            questions.add(new Question(
                    "q_" + batchNumber + "_1",
                    startNum,
                    "How do you manage concurrency and data race conditions when multiple consumers access shared resources in " + primarySkill + "?",
                    category,
                    "technical",
                    primarySkill,
                    difficulty,
                    "Candidate should discuss locks, atomic variables, transactional isolation levels, or optimistic concurrency."
            ));
            questions.add(new Question(
                    "q_" + batchNumber + "_2",
                    startNum + 1,
                    "Compare SQL (relational) vs NoSQL document databases like MongoDB. For what specific use case would you choose each, and why?",
                    category,
                    "conceptual",
                    "Database Systems",
                    difficulty,
                    "Should explain ACID vs BASE, relational integrity, schema flexibility, and horizontal partitioning (sharding)."
            ));
            questions.add(new Question(
                    "q_" + batchNumber + "_3",
                    startNum + 2,
                    "Walk me through how you implemented authentication and authorization in your full-stack applications. How are JWTs secured?",
                    category,
                    "project",
                    "Security & Auth",
                    difficulty,
                    "Should cover signature verification, expiration, HttpOnly cookies or Authorization bearer headers, and CSRF mitigation."
            ));
            questions.add(new Question(
                    "q_" + batchNumber + "_4",
                    startNum + 3,
                    "If a third-party payment or notification API fails intermittently in production, how would you architect your service to guarantee resilience and prevent data loss?",
                    category,
                    "problem-solving",
                    "System Resilience",
                    difficulty,
                    "Should mention circuit breakers, exponential backoff with jitter, dead-letter queues, and idempotent retries."
            ));
            questions.add(new Question(
                    "q_" + batchNumber + "_5",
                    startNum + 4,
                    "Describe a scenario where you received tough or critical code review feedback. How did you handle the feedback and what did you learn?",
                    category,
                    "behavioral",
                    "Growth Mindset",
                    "easy",
                    "Shows humility, openness to feedback, technical growth, and professional communication."
            ));
        } else {
            // Batch 3 or higher
            questions.add(new Question(
                    "q_" + batchNumber + "_1",
                    startNum,
                    "What strategies would you employ to scale an application from 1,000 to 100,000 concurrent daily active users?",
                    category,
                    "technical",
                    "Scalability",
                    difficulty,
                    "Covers caching (Redis/CDN), horizontal scaling, stateless session management, and DB read replicas."
            ));
            questions.add(new Question(
                    "q_" + batchNumber + "_2",
                    startNum + 1,
                    "Explain the difference between synchronous communication (REST/gRPC) and asynchronous event-driven messaging (Kafka/RabbitMQ).",
                    category,
                    "conceptual",
                    "Microservices Architecture",
                    difficulty,
                    "Mentions decoupling, temporal coupling, latency, backpressure, and eventual consistency."
            ));
            questions.add(new Question(
                    "q_" + batchNumber + "_3",
                    startNum + 2,
                    "How do you approach automated testing across Unit, Integration, and End-to-End layers in your development workflow?",
                    category,
                    "technical",
                    "Testing & Quality",
                    difficulty,
                    "Discusses test pyramid, test mocks/stubs, coverage metrics, and regression prevention."
            ));
            questions.add(new Question(
                    "q_" + batchNumber + "_4",
                    startNum + 3,
                    "Imagine a microservice is experiencing sudden out-of-memory errors in production. How would you troubleshoot and pinpoint the root cause?",
                    category,
                    "problem-solving",
                    "DevOps & Debugging",
                    difficulty,
                    "Mentions heap dumps, garbage collection logging, memory profilers, leak detection, and APM metrics."
            ));
            questions.add(new Question(
                    "q_" + batchNumber + "_5",
                    startNum + 4,
                    "Where do you see your engineering journey evolving over the next two years, and what technical domains are you currently exploring?",
                    category,
                    "behavioral",
                    "Career Vision",
                    "easy",
                    "Demonstrates proactive self-learning, ambition, curiosity, and alignment with engineering excellence."
            ));
        }

        return questions;
    }

    @Override
    public Map<String, Object> evaluateBatch(
            int batchNumber,
            String jobRole,
            String difficulty,
            List<Map<String, Object>> questionsAndResponses
    ) {
        List<Map<String, Object>> evaluations = new ArrayList<>();
        double totalBatchScore = 0.0;

        for (Map<String, Object> qr : questionsAndResponses) {
            String questionId = (String) qr.get("questionId");
            String questionText = (String) qr.get("questionText");
            String answer = (String) qr.get("answer");
            Boolean isSkipped = (Boolean) qr.get("isSkipped");

            Map<String, Object> eval = new HashMap<>();
            eval.put("questionId", questionId);
            eval.put("questionText", questionText);
            eval.put("candidateAnswer", answer != null ? answer : "");
            eval.put("isSkipped", Boolean.TRUE.equals(isSkipped));

            if (Boolean.TRUE.equals(isSkipped) || answer == null || answer.trim().isEmpty()) {
                eval.put("score", 0.0);
                Map<String, Double> rubrics = new HashMap<>();
                rubrics.put("relevance", 0.0);
                rubrics.put("technicalAccuracy", 0.0);
                rubrics.put("completeness", 0.0);
                rubrics.put("clarity", 0.0);
                rubrics.put("depthOfExplanation", 0.0);
                eval.put("rubricScores", rubrics);
                eval.put("whatWasDoneWell", "Question was skipped.");
                eval.put("missingConcepts", List.of("Core conceptual definitions", "Practical implementation details", "Edge case analysis"));
                eval.put("areasForImprovement", "Attempt to provide at least high-level architecture thoughts even when unsure.");
                eval.put("suggestedBetterAnswer", "A strong answer would establish the core definition, provide an architectural trade-off, and cite a concrete production use case.");
            } else {
                int wordCount = answer.trim().split("\\s+").length;
                double relevance = Math.min(20.0, 14.0 + Math.min(6.0, wordCount / 10.0));
                double technicalAccuracy = Math.min(20.0, 13.0 + (wordCount > 30 ? 5.0 : 2.0));
                double completeness = Math.min(20.0, 12.0 + (wordCount > 40 ? 6.0 : 3.0));
                double clarity = Math.min(20.0, 15.0 + (answer.contains(".") ? 4.0 : 1.0));
                double depth = Math.min(20.0, 12.0 + (wordCount > 50 ? 6.0 : 2.0));

                double score = relevance + technicalAccuracy + completeness + clarity + depth;
                score = Math.min(96.0, Math.max(50.0, score));

                Map<String, Double> rubrics = new HashMap<>();
                rubrics.put("relevance", relevance);
                rubrics.put("technicalAccuracy", technicalAccuracy);
                rubrics.put("completeness", completeness);
                rubrics.put("clarity", clarity);
                rubrics.put("depthOfExplanation", depth);
                eval.put("rubricScores", rubrics);
                eval.put("score", score);

                eval.put("whatWasDoneWell", "Effective articulation of key concepts with clear reasoning and practical context.");
                eval.put("missingConcepts", List.of("Edge-case handling under extreme load", "Specific framework optimization flags"));
                eval.put("areasForImprovement", "Elaborate more on quantifiable performance benchmarks and failure recovery modes.");
                eval.put("suggestedBetterAnswer", "To achieve top tier: directly mention the architectural contract, state time/space complexity or latency profile, and conclude with how you monitor it in production.");

                totalBatchScore += score;
            }
            evaluations.add(eval);
        }

        double batchAvg = evaluations.isEmpty() ? 0.0 : totalBatchScore / evaluations.size();

        Map<String, Object> result = new HashMap<>();
        result.put("batchNumber", batchNumber);
        result.put("batchScore", Math.round(batchAvg * 10.0) / 10.0);
        result.put("evaluations", evaluations);
        result.put("batchSummary", batchAvg >= 75.0
                ? "Excellent performance in this batch. Strong conceptual grasp demonstrated across questions."
                : "Good attempt with solid foundation. Deepening technical specifics and edge cases will boost readiness.");

        return result;
    }

    @Override
    public Map<String, Object> generateFinalReport(
            String jobRole,
            String difficulty,
            List<String> skills,
            int batchCount,
            List<Map<String, Object>> allBatchEvaluations
    ) {
        Map<String, Object> report = new HashMap<>();
        int totalQuestions = allBatchEvaluations.size();
        int attempted = 0;
        int skipped = 0;
        double sumScore = 0.0;

        for (Map<String, Object> ev : allBatchEvaluations) {
            Boolean isSkipped = (Boolean) ev.get("isSkipped");
            if (Boolean.TRUE.equals(isSkipped)) {
                skipped++;
            } else {
                attempted++;
                Object sc = ev.get("score");
                if (sc instanceof Number) {
                    sumScore += ((Number) sc).doubleValue();
                }
            }
        }

        double overallScore = totalQuestions > 0 ? (sumScore / totalQuestions) : 75.0;
        overallScore = Math.round(overallScore * 10.0) / 10.0;
        report.put("overallScore", overallScore);

        String tier;
        if (overallScore >= 85) tier = "Exceptional";
        else if (overallScore >= 75) tier = "Interview Ready";
        else if (overallScore >= 60) tier = "Emerging";
        else tier = "Needs Practice";

        report.put("readinessTier", tier);
        report.put("totalQuestions", totalQuestions);
        report.put("attemptedQuestions", attempted);
        report.put("skippedQuestions", skipped);
        report.put("executiveSummary", "Candidate exhibited solid fundamentals in " + jobRole + " concepts with strong problem-solving orientation. Communicates architectural trade-offs effectively.");

        List<Map<String, Object>> skillScores = new ArrayList<>();
        if (skills != null) {
            for (String sk : skills) {
                Map<String, Object> skMap = new HashMap<>();
                skMap.put("skill", sk);
                double skScore = Math.min(95.0, Math.max(65.0, overallScore + (Math.random() * 8.0 - 4.0)));
                skMap.put("score", Math.round(skScore * 10.0) / 10.0);
                skMap.put("proficiency", skScore >= 80 ? "Advanced" : "Proficient");
                skillScores.add(skMap);
            }
        }
        report.put("skillScores", skillScores);

        report.put("strongestAreas", List.of(
                "Clear architectural decomposition and component design",
                "Understanding of core lifecycle and REST principles",
                "Structured approach to problem solving under ambiguity"
        ));

        report.put("weakestAreas", List.of(
                "Distributed consistency guarantees and cache invalidation",
                "In-depth analysis of edge cases and concurrency locks"
        ));

        report.put("missingTechnicalConcepts", List.of(
                "Two-phase commit vs Saga distributed transaction patterns",
                "Memory leak detection and heap dump profiling"
        ));

        List<Map<String, Object>> improvementPlan = new ArrayList<>();
        Map<String, Object> plan1 = new HashMap<>();
        plan1.put("area", "Distributed Systems & Caching");
        plan1.put("suggestion", "Study cache-aside vs write-through patterns and Redis persistence modes (RDB/AOF).");
        plan1.put("priority", "High");
        improvementPlan.add(plan1);

        Map<String, Object> plan2 = new HashMap<>();
        plan2.put("area", "Concurrency & Threading");
        plan2.put("suggestion", "Review thread safety, race condition prevention, and Java modern concurrency utilities.");
        plan2.put("priority", "Medium");
        improvementPlan.add(plan2);
        report.put("actionableImprovementPlan", improvementPlan);

        List<Map<String, Object>> studyTopics = new ArrayList<>();
        Map<String, Object> topic1 = new HashMap<>();
        topic1.put("topic", "System Design Scalability Patterns");
        topic1.put("reason", "Frequently asked in senior and technical interviews for " + jobRole + ".");
        topic1.put("recommendedAction", "Practice designing high-throughput URL shorteners and rate limiters.");
        studyTopics.add(topic1);

        Map<String, Object> topic2 = new HashMap<>();
        topic2.put("topic", "Database Index Optimization");
        topic2.put("reason", "Critical for justifying database choices and query efficiency.");
        topic2.put("recommendedAction", "Analyze B-tree vs Hash indexes and compound index ordering rules.");
        studyTopics.add(topic2);
        report.put("recommendedStudyTopics", studyTopics);

        return report;
    }
}
