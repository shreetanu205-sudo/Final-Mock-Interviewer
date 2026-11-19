# PrepOrbit: Your Personal AI Interview Studio

<div align="center">
  <img src="frontend/public/logo.svg" alt="PrepOrbit Logo" width="96" height="96" />
  <h3><strong>PrepOrbit: AI Mock Interview Platform</strong></h3>
  <p><em>Practise the questions. Own the room.</em></p>
</div>

---

## 1. Project Overview

**PrepOrbit** is an AI-powered mock interview preparation and career readiness studio designed primarily for students, fresh graduates, and tech job seekers.

Rather than stressful single-question quizzes, PrepOrbit organizes practice into thoughtful **5-question batches**. Candidates can review questions together, answer via text or natural speech, save drafts, skip and revisit, and receive constructive AI-based rubric evaluations and actionable study plans.

### Key Capabilities
- **Resume Intelligence & ATS Analyzer**: Upload resumes in PDF, DOCX, or TXT format. Extracts skills, projects, and experience, calculates an estimated ATS compatibility index, and highlights missing keywords.
- **5-Question Batch Workflow**: Practice in structured batches (Batch 1: Q1–Q5, Batch 2: Q6–Q10, etc.). Submit all 5 questions together for comprehensive evaluation.
- **Voice-Based Practice Studio**: Hear questions read aloud with Text-to-Speech (TTS) and speak answers aloud with real-time Speech-to-Text (STT) transcription and audio playback.
- **Objective 5-Point Evaluation Engine**: Responses are scored objectively on Relevance (0–20), Technical Accuracy (0–20), Completeness (0–20), Clarity (0–20), and Depth of Explanation (0–20), with model answers and missing concepts provided.
- **Performance Reports & Analytics**: Interactive charts (Recharts) displaying score progression, skill mastery bars, and actionable study roadmaps, with printable PDF export.
- **Roadmap / Coming Soon**: Pre-architected future scope card for opt-in webcam posture and engagement analysis.

---

## 2. Technology Stack

### Frontend
- **React.js 18** + **Vite**
- **Tailwind CSS** (Editorial warm cream `#FFF7F0` & deep plum `#24102F` palette)
- **Lucide React** (Modern iconography)
- **Recharts** (Visualizations and skill analytics)
- **Axios** (REST communication with JWT bearer interceptors)
- **React Router DOM v6** (Protected and public routing)
- **Web Speech API** + **MediaRecorder** (Voice STT, TTS, and audio playback)

### Backend
- **Java 17** + **Spring Boot 3.2.5**
- **Spring Security 6** (Stateless JWT authentication & BCrypt password hashing)
- **Spring Data MongoDB** (MongoDB Atlas & local support)
- **Apache PDFBox** & **Apache POI** (PDF & DOCX resume text extraction)
- **Maven** (with bundled Maven wrapper `mvnw` and `mvnw.cmd`)
- **Configurable AI Service Layer** (Google Gemini, OpenAI, or built-in intelligent mock evaluator)

---

## 3. Project Directory Structure

```
Final mock interviewer/
├── frontend/
│   ├── public/
│   │   └── logo.svg                 # Planet/orbit logo asset
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Navbar, Footer, Button, Card, Badge, Modal, Alert
│   │   │   └── landing/             # Hero, HowItWorks, Features, Benefits, Testimonials, CTA
│   │   ├── context/                 # AuthContext (JWT, user profile state)
│   │   ├── hooks/                   # useSpeechRecognition, useSpeechSynthesis, useAudioRecorder
│   │   ├── layouts/                 # MainLayout, ProtectedRoute
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Editorial Landing Page
│   │   │   ├── Login.jsx            # Sign In with 1-click Demo credentials
│   │   │   ├── Register.jsx         # Sign Up with role preferences
│   │   │   ├── ForgotPassword.jsx   # Password recovery interface
│   │   │   ├── Dashboard.jsx        # Personalized candidate dashboard
│   │   │   ├── ResumeAnalyzer.jsx   # PDF/DOCX parsing & ATS compatibility
│   │   │   ├── InterviewSetup.jsx   # 5-question batch studio configuration
│   │   │   ├── InterviewSession.jsx # Text & Voice 5-question workspace
│   │   │   ├── PerformanceReport.jsx# Final score report & PDF print view
│   │   │   ├── Analytics.jsx        # Score progression & skill mastery charts
│   │   │   ├── Profile.jsx          # Profile details & stored resumes
│   │   │   └── NotFound.jsx         # 404 page
│   │   ├── services/                # api, authService, resumeService, interviewService, reportService, analyticsService
│   │   ├── App.jsx                  # Route definitions
│   │   ├── index.css                # CSS variables & typography tokens
│   │   └── main.jsx                 # React root mount
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── Dockerfile
│   └── nginx.conf
├── backend/
│   ├── src/main/java/com/preporbit/
│   │   ├── config/                  # SecurityConfig, CorsConfig, AppProperties
│   │   ├── controller/              # Auth, User, Resume, Interview, Report, Analytics, Health
│   │   ├── service/                 # UserService, ResumeService, InterviewService, ReportService, AnalyticsService
│   │   ├── repository/              # MongoRepositories for all entities
│   │   ├── model/                   # User, Resume, Interview, QuestionBatch, Question, Response, Report
│   │   ├── dto/                     # Strongly typed request/response DTOs
│   │   ├── security/                # JwtTokenProvider, JwtAuthFilter, UserPrincipal
│   │   ├── ai/                      # AiClient, GeminiAiClient, OpenAiClient, MockAiClient, AiServiceFactory
│   │   ├── resume/                  # ResumeParserService, AtsEvaluator
│   │   ├── exception/               # GlobalExceptionHandler, custom exceptions
│   │   └── PrepOrbitApplication.java# Spring Boot entry point
│   ├── src/main/resources/
│   │   ├── application.yml          # Core server & cloud properties
│   │   └── prompts/                 # Separated LLM prompt templates
│   ├── pom.xml
│   ├── mvnw & mvnw.cmd              # Maven wrapper scripts
│   ├── Dockerfile
│   └── .env.example
├── docs/
│   ├── API_DOCUMENTATION.md         # Full REST API contracts & sample JSONs
│   ├── DEPLOYMENT_GUIDE.md          # Step-by-step Vercel, Render, & Atlas guides
│   └── ARCHITECTURE.md              # Technical design and workflow blueprints
├── docker-compose.yml               # Multi-container local orchestration
└── README.md
```

---

## 4. Local Development Setup

### Prerequisites
- **Node.js** (v18+)
- **Java OpenJDK** (v17+)
- **MongoDB** (Local instance or free MongoDB Atlas URI)

### Step 1: Start Backend
1. Open a terminal in `backend/`:
   ```bash
   cd backend
   ```
2. (Optional) Configure environment variables or copy `.env.example`:
   ```bash
   # Set your MongoDB Atlas URI (or use local default mongodb://localhost:27017/preporbit)
   export MONGODB_URI="mongodb://localhost:27017/preporbit"
   
   # Optional: Configure your Gemini or OpenAI API Key
   export LLM_PROVIDER="gemini"
   export LLM_API_KEY="your_api_key_here"
   ```
   *(Note: If no API key is set, PrepOrbit's intelligent deterministic mock engine runs automatically with zero errors!)*

3. Run the Spring Boot application using the bundled Maven wrapper:
   - On Windows:
     ```cmd
     mvnw.cmd spring-boot:run
     ```
   - On Linux/macOS:
     ```bash
     ./mvnw spring-boot:run
     ```
4. Verify backend health:
   ```bash
   curl http://localhost:8080/api/health
   ```

### Step 2: Start Frontend
1. Open a new terminal in `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser at:
   ```
   http://localhost:5173
   ```

---

## 5. One-Click Docker Setup

To launch the full full-stack application (MongoDB + Spring Boot Backend + React Frontend):

```bash
docker compose up --build
```

Access points:
- **Frontend**: `http://localhost`
- **Backend API**: `http://localhost:8080/api`
- **Health Check**: `http://localhost:8080/api/health`

---

## 6. Cloud Deployment Instructions

| Component | Target Platform | Instructions Link |
|---|---|---|
| **Frontend** | Vercel | [docs/DEPLOYMENT_GUIDE.md](file:///c:/Users/shree/OneDrive/Desktop/Projects/Final%20mock%20interviewer/docs/DEPLOYMENT_GUIDE.md#4-frontend-deployment-vercel) |
| **Backend** | Render / Railway | [docs/DEPLOYMENT_GUIDE.md](file:///c:/Users/shree/OneDrive/Desktop/Projects/Final%20mock%20interviewer/docs/DEPLOYMENT_GUIDE.md#2-backend-deployment-render) |
| **Database** | MongoDB Atlas | [docs/DEPLOYMENT_GUIDE.md](file:///c:/Users/shree/OneDrive/Desktop/Projects/Final%20mock interviewer/docs/DEPLOYMENT_GUIDE.md#1-database-setup-mongodb-atlas) |

---

## 7. Security & Privacy Highlights
- **JWT Authentication**: Secure Bearer tokens with HMAC-SHA256 signatures and 24-hour expiration.
- **Passwords**: One-way BCrypt hashing with strong salt rounds.
- **No Client Secrets**: API keys (`LLM_API_KEY`, `MONGODB_URI`, `JWT_SECRET`) reside exclusively on the backend.
- **Data Isolation**: User-specific MongoDB scoping ensures candidates can only access their own resumes, interviews, and reports.
- **Voice Privacy**: Browser microphone audio is recorded into client-side volatile memory for playback and transcription, and is never stored permanently on disks without explicit candidate consent.
