package com.preporbit.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AppProperties {

    @Value("${app.jwt.secret:PrepOrbitSecretKeyForJwtAuthenticationTokensMustBeLongEnoughForSha256Security}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms:86400000}")
    private long jwtExpirationMs;

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173}")
    private String corsAllowedOrigins;

    @Value("${app.ai.provider:gemini}")
    private String aiProvider;

    @Value("${app.ai.api-key:}")
    private String aiApiKey;

    @Value("${app.ai.model:gemini-1.5-flash}")
    private String aiModel;

    @Value("${app.ai.timeout-ms:30000}")
    private int aiTimeoutMs;

    public String getJwtSecret() {
        return jwtSecret;
    }

    public long getJwtExpirationMs() {
        return jwtExpirationMs;
    }

    public String getCorsAllowedOrigins() {
        return corsAllowedOrigins;
    }

    public String getAiProvider() {
        return aiProvider;
    }

    public String getAiApiKey() {
        return aiApiKey;
    }

    public String getAiModel() {
        return aiModel;
    }

    public int getAiTimeoutMs() {
        return aiTimeoutMs;
    }
}
