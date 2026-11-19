package com.preporbit.ai;

import com.preporbit.config.AppProperties;
import org.springframework.stereotype.Service;

@Service
public class AiServiceFactory {

    private final AppProperties appProperties;
    private final GeminiAiClient geminiAiClient;
    private final OpenAiClient openAiClient;
    private final MockAiClient mockAiClient;

    public AiServiceFactory(AppProperties appProperties, GeminiAiClient geminiAiClient, OpenAiClient openAiClient, MockAiClient mockAiClient) {
        this.appProperties = appProperties;
        this.geminiAiClient = geminiAiClient;
        this.openAiClient = openAiClient;
        this.mockAiClient = mockAiClient;
    }

    public AiClient getClient() {
        String provider = appProperties.getAiProvider();
        if (provider != null) {
            String lower = provider.trim().toLowerCase();
            if ("openai".equals(lower)) {
                return openAiClient;
            } else if ("mock".equals(lower)) {
                return mockAiClient;
            }
        }
        return geminiAiClient;
    }
}
