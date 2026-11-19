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
public class OpenAiClient implements AiClient {

    private static final Logger logger = LoggerFactory.getLogger(OpenAiClient.class);

    private final AppProperties appProperties;
    private final MockAiClient mockFallback;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public OpenAiClient(AppProperties appProperties, MockAiClient mockFallback) {
        this.appProperties = appProperties;
        this.mockFallback = mockFallback;
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();
    }

    private String callOpenAi(String systemPrompt, String userPrompt) {
        String apiKey = appProperties.getAiApiKey();
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new AiServiceException("OpenAI API key is not configured. Set LLM_API_KEY environment variable.");
        }

        String model = appProperties.getAiModel();
        if (model == null || model.trim().isEmpty() || model.startsWith("gemini")) {
            model = "gpt-4o-mini";
        }

        String url = "https://api.openai.com/v1/chat/completions";

        try {
            Map<String, Object> sysMsg = Map.of("role", "system", "content", systemPrompt);
            Map<String, Object> userMsg = Map.of("role", "user", "content", userPrompt);

            Map<String, Object> payload = new HashMap<>();
            payload.put("model", model);
            payload.put("messages", List.of(sysMsg, userMsg));
            payload.put("response_format", Map.of("type", "json_object"));
            payload.put("temperature", 0.7);

            String requestBody = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey.trim())
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .timeout(Duration.ofMillis(appProperties.getAiTimeoutMs()))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                logger.error("OpenAI API returned error: status={}, body={}", response.statusCode(), response.body());
                throw new AiServiceException("OpenAI API error (" + response.statusCode() + "): " + response.body());
            }

            JsonNode rootNode = objectMapper.readTree(response.body());
            JsonNode choices = rootNode.path("choices");
            if (choices.isArray() && !choices.isEmpty()) {
                return choices.get(0).path("message").path("content").asText();
            }

            throw new AiServiceException("Empty response received from OpenAI API.");
        } catch (AiServiceException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Failed to execute OpenAI API call", e);
            throw new AiServiceException("Failed to call OpenAI: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> analyzeResume(String resumeText, String targetJobDescription) {
        String apiKey = appProperties.getAiApiKey();
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return mockFallback.analyzeResume(resumeText, targetJobDescription);
        }

        try {
            String sys = "You are an expert ATS recruiter. Respond strictly in JSON format.";
            String user = "Analyze this resume against the target job description (" + (targetJobDescription != null ? targetJobDescription : "Software Engineer") + "):\n\n"
                    + resumeText + "\n\nProvide fields: candidateName, professionalSummary, technicalSkills, softSkills, atsScore, atsScoreBreakdown, identifiedMissingSkills, improvementSuggestions.";
            String json = callOpenAi(sys, user);
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            logger.warn("OpenAI resume analysis failed, falling back to mock: {}", e.getMessage());
            return mockFallback.analyzeResume(resumeText, targetJobDescription);
        }
    }

    @Override
    public List<Question> generateQuestionBatch(int batchNumber, int totalBatches, String jobRole, List<String> skills, String difficulty, String category, String resumeContext, String previousBatchContext) {
        String apiKey = appProperties.getAiApiKey();
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return mockFallback.generateQuestionBatch(batchNumber, totalBatches, jobRole, skills, difficulty, category, resumeContext, previousBatchContext);
        }

        try {
            String sys = "You are PrepOrbit's Principal AI Interviewer. Generate exactly 5 questions for Batch " + batchNumber + " in JSON under a 'questions' key.";
            String user = "Role: " + jobRole + ", Skills: " + String.join(", ", skills) + ", Difficulty: " + difficulty + ", Category: " + category + ", Resume Context: " + resumeContext;
            String json = callOpenAi(sys, user);
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
            throw new IllegalStateException("OpenAI did not return 5 questions");
        } catch (Exception e) {
            logger.warn("OpenAI question generation failed, falling back to mock: {}", e.getMessage());
            return mockFallback.generateQuestionBatch(batchNumber, totalBatches, jobRole, skills, difficulty, category, resumeContext, previousBatchContext);
        }
    }

    @Override
    public Map<String, Object> evaluateBatch(int batchNumber, String jobRole, String difficulty, List<Map<String, Object>> questionsAndResponses) {
        String apiKey = appProperties.getAiApiKey();
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return mockFallback.evaluateBatch(batchNumber, jobRole, difficulty, questionsAndResponses);
        }

        try {
            String sys = "You are PrepOrbit's Senior Interview Evaluation Engine. Evaluate the 5-question batch in JSON.";
            String qrJson = objectMapper.writeValueAsString(questionsAndResponses);
            String json = callOpenAi(sys, "Role: " + jobRole + ", Responses: " + qrJson);
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            logger.warn("OpenAI batch evaluation failed, falling back to mock: {}", e.getMessage());
            return mockFallback.evaluateBatch(batchNumber, jobRole, difficulty, questionsAndResponses);
        }
    }

    @Override
    public Map<String, Object> generateFinalReport(String jobRole, String difficulty, List<String> skills, int batchCount, List<Map<String, Object>> allBatchEvaluations) {
        String apiKey = appProperties.getAiApiKey();
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return mockFallback.generateFinalReport(jobRole, difficulty, skills, batchCount, allBatchEvaluations);
        }

        try {
            String sys = "Synthesize complete interview evaluations and generate a final performance report in JSON.";
            String evalJson = objectMapper.writeValueAsString(allBatchEvaluations);
            String json = callOpenAi(sys, "Role: " + jobRole + ", Evaluations: " + evalJson);
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            logger.warn("OpenAI report synthesis failed, falling back to mock: {}", e.getMessage());
            return mockFallback.generateFinalReport(jobRole, difficulty, skills, batchCount, allBatchEvaluations);
        }
    }
}
