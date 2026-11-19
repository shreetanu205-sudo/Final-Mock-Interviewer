# PrepOrbit Architecture & Technical Design

## 1. System Architecture Overview

PrepOrbit is engineered using an N-tier decoupled architecture with high separation of concerns:

```
[ Client Browser: React 18 SPA (Vite + Tailwind + Recharts) ]
        │                       │
        │ HTTP REST (JSON)      │ Browser Web Speech API
        │ Bearer JWT Auth       │ STT / TTS & MediaRecorder
        ▼                       ▼
[ Spring Boot 3 REST API Server (Java 17) ]
        ├── Security & Filter Layer (JWT Auth, CORS, BCrypt)
        ├── Business Service Layer (Interview, Resume, Evaluation, Analytics)
        ├── Document Parser (Apache PDFBox & Apache POI)
        ├── AI Provider Abstraction (Gemini, OpenAI, Mock Fallback)
        └── Repository Layer (Spring Data MongoDB)
                                │
                                ▼
                   [ MongoDB Atlas Database ]
                   ├── users
                   ├── resumes
                   ├── interviews
                   ├── question_batches
                   ├── responses
                   └── reports
```

---

## 2. Core Workflows & Logic

### A. 5-Question Batch Workflow
Unlike common single-question platforms that create continuous evaluation anxiety, PrepOrbit batches questions into cohesive sets of exactly five:
1. `POST /api/interviews` initializes the interview and generates Batch 1 (Questions 1–5).
2. The candidate explores all 5 questions simultaneously in the studio navigator, drafting responses in text or voice.
3. Candidate can move forward and backward, skip questions, and review transcripts.
4. On batch submit (`POST /api/interviews/{id}/submit-batch`), all 5 responses are evaluated together.
5. The AI evaluation engine scores each response on 5 criteria:
   - Relevance (0–20)
   - Technical Accuracy (0–20)
   - Completeness (0–20)
   - Clarity (0–20)
   - Depth of Explanation (0–20)
6. For Batch 2+ (Questions 6–10, 11–15), questions are adaptively tuned based on performance without discouraging the candidate.
7. Upon the final batch, a comprehensive final report is generated.

### B. Resume & ATS Heuristic
- Resumes in PDF, DOCX, or TXT formats are parsed into structured entities (Name, Email, Phone, Technical Skills, Education, Projects, Experience).
- An ATS compatibility index is calculated based on keyword density, standard header presence, and quantifiable metrics.
- Disclaimers clearly communicate that this score is an estimated heuristic for skill gap identification.

### C. Voice Studio Integration
- Utilizes the browser's native Web Speech API (`SpeechRecognition`) for low-latency live speech transcription.
- Utilizes `speechSynthesis` for natural audio question playback.
- Utilizes `MediaRecorder` for audio capture and in-browser playback.
- Graceful degradation: if a browser lacks speech capabilities, a clear banner directs the user to continue seamlessly in Text-based mode.

---

## 3. Resilience and Provider Decoupling
The AI service layer (`AiClient`) is abstracted behind an interface. If the external LLM key is omitted or throws rate-limit errors, the system seamlessly uses the local intelligent mock evaluator, ensuring zero downtime for evaluation demonstrations or student reviews.
