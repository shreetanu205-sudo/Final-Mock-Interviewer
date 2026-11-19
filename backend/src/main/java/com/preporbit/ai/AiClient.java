package com.preporbit.ai;

import com.preporbit.model.Question;

import java.util.List;
import java.util.Map;

public interface AiClient {

    Map<String, Object> analyzeResume(String resumeText, String targetJobDescription);

    List<Question> generateQuestionBatch(
            int batchNumber,
            int totalBatches,
            String jobRole,
            List<String> skills,
            String difficulty,
            String category,
            String resumeContext,
            String previousBatchContext
    );

    Map<String, Object> evaluateBatch(
            int batchNumber,
            String jobRole,
            String difficulty,
            List<Map<String, Object>> questionsAndResponses
    );

    Map<String, Object> generateFinalReport(
            String jobRole,
            String difficulty,
            List<String> skills,
            int batchCount,
            List<Map<String, Object>> allBatchEvaluations
    );
}
