package com.preporbit.ai;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.preporbit.config.AppProperties;
import com.preporbit.exception.AiServiceException;
import com.preporbit.model.Question;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

@Component
public class GeminiAiClient implements AiClient {

    private static final Logger logger = LoggerFactory.getLogger(GeminiAiClient.class);

    private final AppProperties appProperties;
    private final MockAiClient mockFallback;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public GeminiAiClient(AppProperties appProperties, MockAiClient mockFallback) {
        this.appProperties = appProperties;
        this.mockFallback = mockFallback;
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();
    }

    private String callGemini(String promptText) {
        String apiKey = appProperties.getAiApiKey();
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new AiServiceException("Gemini API key is not configured. Set LLM_API_KEY environment variable.");
        }

        String model = appProperties.getAiModel();
        if (model == null || model.trim().isEmpty()) {
            model = "gemini-1.5-flash";
        }

        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey.trim();

        try {
            Map<String, Object> part = Map.of("text", promptText);
            Map<String, Object> content = Map.of("parts", List.of(part));
            Map<String, Object> payload = Map.of("contents", List.of(content));

            String requestBody = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .timeout(Duration.ofMillis(appProperties.getAiTimeoutMs()))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                logger.error("Gemini API returned error: status={}, body={}", response.statusCode(), response.body());
                throw new AiServiceException("Gemini API error (" + response.statusCode() + "): " + response.body());
            }

            JsonNode rootNode = objectMapper.readTree(response.body());
            JsonNode candidates = rootNode.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                JsonNode parts = candidates.get(0).path("content").path("parts");
                if (parts.isArray() && !parts.isEmpty()) {
                    String rawText = parts.get(0).path("text").asText();
                    return cleanJsonMarkdown(rawText);
                }
            }

            throw new AiServiceException("Empty response received from Gemini API.");
        } catch (AiServiceException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Failed to execute Gemini API call", e);
            throw new AiServiceException("Failed to call Gemini AI: " + e.getMessage(), e);
        }
    }

    private String cleanJsonMarkdown(String raw) {
        if (raw == null) return "{}";
        String trimmed = raw.trim();
        if (trimmed.startsWith("```json")) {
            trimmed = trimmed.substring(7);
        } else if (trimmed.startsWith("```")) {
            trimmed = trimmed.substring(3);
        }
        if (trimmed.endsWith("```")) {
            trimmed = trimmed.substring(0, trimmed.length() - 3);
        }
        return trimmed.trim();
    }

    @Override
    public Map<String, Object> analyzeResume(String resumeText, String targetJobDescription) {
        String apiKey = appProperties.getAiApiKey();
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return mockFallback.analyzeResume(resumeText, targetJobDescription);
        }

        try {
            String prompt = "You are an expert ATS parser and technical recruiter.\n"
                    + "Analyze this resume against the target job description.\n"
                    + "Target Job Description: " + (targetJobDescription != null ? targetJobDescription : "General Software Engineer") + "\n\n"
                    + "Resume Text:\n" + resumeText + "\n\n"
                    + "Respond strictly in JSON with fields: candidateName, professionalSummary, technicalSkills (array), softSkills (array), atsScore (number), atsScoreBreakdown (object with keywordMatch, formatAndStructure, skillsAlignment, experienceRelevance), identifiedMissingSkills (array), improvementSuggestions (array).";

            String json = callGemini(prompt);
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            logger.warn("Gemini resume analysis failed, falling back to heuristic engine: {}", e.getMessage());
            return mockFallback.analyzeResume(resumeText, targetJobDescription);
        }
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
        String apiKey = appProperties.getAiApiKey();
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return mockFallback.generateQuestionBatch(batchNumber, totalBatches, jobRole, skills, difficulty, category, resumeContext, previousBatchContext);
        }

        try {
            String prompt = "Generate a set of exactly FIVE (5) interview questions for Batch " + batchNumber + " of " + totalBatches + ".\n"
                    + "Job Role: " + jobRole + "\n"
                    + "Skills: " + String.join(", ", skills) + "\n"
                    + "Difficulty: " + difficulty + "\n"
                    + "Category: " + category + "\n"
                    + "Resume/Projects Context: " + (resumeContext != null ? resumeContext : "None") + "\n"
                    + "Previous Batch Context: " + (previousBatchContext != null ? previousBatchContext : "First batch") + "\n\n"
                    + "Respond strictly in JSON with this structure:\n"
                    + "{\n"
                    + "  \"questions\": [\n"
                    + "    {\"id\":\"q_" + batchNumber + "_1\", \"questionNumber\":" + ((batchNumber-1)*5+1) + ", \"text\":\"...\", \"category\":\"" + category + "\", \"type\":\"conceptual\", \"targetSkill\":\"...\", \"difficulty\":\"" + difficulty + "\", \"evaluationHints\":\"...\"},\n"
                    + "    {\"id\":\"q_" + batchNumber + "_2\", \"questionNumber\":" + ((batchNumber-1)*5+2) + ", \"text\":\"...\", \"category\":\"" + category + "\", \"type\":\"technical\", \"targetSkill\":\"...\", \"difficulty\":\"" + difficulty + "\", \"evaluationHints\":\"...\"},\n"
                    + "    {\"id\":\"q_" + batchNumber + "_3\", \"questionNumber\":" + ((batchNumber-1)*5+3) + ", \"text\":\"...\", \"category\":\"" + category + "\", \"type\":\"project\", \"targetSkill\":\"...\", \"difficulty\":\"" + difficulty + "\", \"evaluationHints\":\"...\"},\n"
                    + "    {\"id\":\"q_" + batchNumber + "_4\", \"questionNumber\":" + ((batchNumber-1)*5+4) + ", \"text\":\"...\", \"category\":\"" + category + "\", \"type\":\"problem-solving\", \"targetSkill\":\"...\", \"difficulty\":\"" + difficulty + "\", \"evaluationHints\":\"...\"},\n"
                    + "    {\"id\":\"q_" + batchNumber + "_5\", \"questionNumber\":" + ((batchNumber-1)*5+5) + ", \"text\":\"...\", \"category\":\"" + category + "\", \"type\":\"behavioral\", \"targetSkill\":\"...\", \"difficulty\":\"easy\", \"evaluationHints\":\"...\"}\n"
                    + "  ]\n"
                    + "}";

            String json = callGemini(prompt);
            JsonNode root = objectMapper.readTree(json);
            JsonNode qNode = root.path("questions");
            if (qNode.isArray() && qNode.size() >= 5) {
                List<Question> list = new ArrayList<>();
                for (int i = 0; i < 5; i++) {
                    JsonNode item = qNode.get(i);
                    list.add(new Question(
                            item.path("id").asText("q_" + batchNumber + "_" + (i + 1)),
                            item.path("questionNumber").asInt((batchNumber - 1) * 5 + i + 1),
                            item.path("text").asText(),
                            item.path("category").asText(category),
                            item.path("type").asText("technical"),
                            item.path("targetSkill").asText(skills.isEmpty() ? "General" : skills.get(0)),
                            item.path("difficulty").asText(difficulty),
                            item.path("evaluationHints").asText()
                    ));
                }
                return list;
            }
            throw new IllegalStateException("Gemini did not return 5 questions");
        } catch (Exception e) {
            logger.warn("Gemini question generation failed, falling back to mock generator: {}", e.getMessage());
            return mockFallback.generateQuestionBatch(batchNumber, totalBatches, jobRole, skills, difficulty, category, resumeContext, previousBatchContext);
        }
    }

    @Override
    public Map<String, Object> evaluateBatch(
            int batchNumber,
            String jobRole,
            String difficulty,
            List<Map<String, Object>> questionsAndResponses
    ) {
        String apiKey = appProperties.getAiApiKey();
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return mockFallback.evaluateBatch(batchNumber, jobRole, difficulty, questionsAndResponses);
        }

        try {
            String qrJson = objectMapper.writeValueAsString(questionsAndResponses);
            String prompt = "You are PrepOrbit's Senior Interview Evaluation Engine.\n"
                    + "Evaluate the candidate's answers for Batch " + batchNumber + ".\n"
                    + "Job Role: " + jobRole + ", Difficulty: " + difficulty + "\n"
                    + "Questions & Responses: " + qrJson + "\n\n"
                    + "Evaluate each question on: relevance (0-20), technicalAccuracy (0-20), completeness (0-20), clarity (0-20), depthOfExplanation (0-20).\n"
                    + "Respond strictly in JSON:\n"
                    + "{\n"
                    + "  \"batchNumber\": " + batchNumber + ",\n"
                    + "  \"batchScore\": 80.0,\n"
                    + "  \"batchSummary\": \"Summary of batch performance\",\n"
                    + "  \"evaluations\": [\n"
                    + "    {\n"
                    + "      \"questionId\": \"...\",\n"
                    + "      \"questionText\": \"...\",\n"
                    + "      \"candidateAnswer\": \"...\",\n"
                    + "      \"isSkipped\": false,\n"
                    + "      \"score\": 82.0,\n"
                    + "      \"rubricScores\": {\"relevance\":18,\"technicalAccuracy\":16,\"completeness\":16,\"clarity\":16,\"depthOfExplanation\":16},\n"
                    + "      \"whatWasDoneWell\": \"...\",\n"
                    + "      \"missingConcepts\": [\"...\"],\n"
                    + "      \"areasForImprovement\": \"...\",\n"
                    + "      \"suggestedBetterAnswer\": \"...\"\n"
                    + "    }\n"
                    + "  ]\n"
                    + "}";

            String json = callGemini(prompt);
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            logger.warn("Gemini batch evaluation failed, falling back to mock evaluator: {}", e.getMessage());
            return mockFallback.evaluateBatch(batchNumber, jobRole, difficulty, questionsAndResponses);
        }
    }

    @Override
    public Map<String, Object> generateFinalReport(
            String jobRole,
            String difficulty,
            List<String> skills,
            int batchCount,
            List<Map<String, Object>> allBatchEvaluations
    ) {
        String apiKey = appProperties.getAiApiKey();
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return mockFallback.generateFinalReport(jobRole, difficulty, skills, batchCount, allBatchEvaluations);
        }

        try {
            String evaluationsJson = objectMapper.writeValueAsString(allBatchEvaluations);
            String prompt = "Synthesize these complete interview evaluations and generate a final performance report.\n"
                    + "Job Role: " + jobRole + ", Difficulty: " + difficulty + ", Skills: " + String.join(", ", skills) + "\n"
                    + "Evaluations: " + evaluationsJson + "\n\n"
                    + "Respond strictly in JSON with fields: overallScore (number), readinessTier (string), totalQuestions (int), attemptedQuestions (int), skippedQuestions (int), executiveSummary (string), skillScores (array of {skill, score, proficiency}), strongestAreas (array), weakestAreas (array), missingTechnicalConcepts (array), actionableImprovementPlan (array of {area, suggestion, priority}), recommendedStudyTopics (array of {topic, reason, recommendedAction}).";

            String json = callGemini(prompt);
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            logger.warn("Gemini final report synthesis failed, falling back to mock synthesizer: {}", e.getMessage());
            return mockFallback.generateFinalReport(jobRole, difficulty, skills, batchCount, allBatchEvaluations);
        }
    }
}
