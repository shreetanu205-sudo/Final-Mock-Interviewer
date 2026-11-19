# PrepOrbit API Reference Documentation

All endpoints are served under `/api` and return standard JSON payloads. Protected endpoints require the `Authorization: Bearer <JWT_TOKEN>` header.

---

## 1. Authentication APIs

### Register Candidate
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "fullName": "Alex Rivera",
    "email": "alex@university.edu",
    "password": "Password123!",
    "targetRole": "Full Stack Developer"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "userId": "673dfa100f2e02613d99d102",
    "email": "alex@university.edu",
    "fullName": "Alex Rivera",
    "targetRole": "Full Stack Developer"
  }
  ```

### Login Candidate
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "alex@university.edu",
    "password": "Password123!"
  }
  ```
- **Response** (200 OK): Same as Register response.

### Forgot Password
- **Endpoint**: `POST /api/auth/forgot-password`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "alex@university.edu"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "message": "If an account with alex@university.edu exists, a password reset link has been dispatched to your email address."
  }
  ```

---

## 2. User & Profile APIs

### Get Current User Profile
- **Endpoint**: `GET /api/users/me`
- **Access**: Bearer Token
- **Response** (200 OK):
  ```json
  {
    "id": "673dfa100f2e02613d99d102",
    "email": "alex@university.edu",
    "fullName": "Alex Rivera",
    "targetRole": "Full Stack Developer",
    "skills": ["Java", "Spring Boot", "React", "MongoDB"],
    "education": "B.Tech Computer Science",
    "bio": "Passionate about full-stack architectures and high-scale APIs.",
    "createdAt": "2026-11-19T06:30:00Z"
  }
  ```

### Update User Profile
- **Endpoint**: `PUT /api/users/me`
- **Access**: Bearer Token
- **Request Body**:
  ```json
  {
    "fullName": "Alex Rivera",
    "targetRole": "Backend Developer",
    "skills": ["Java", "Spring Boot", "PostgreSQL", "Docker"],
    "education": "B.Tech Computer Science (2024)",
    "bio": "Focused on backend microservices."
  }
  ```

---

## 3. Resume & ATS APIs

### Upload & Analyze Resume
- **Endpoint**: `POST /api/resumes/upload`
- **Access**: Bearer Token
- **Form Data**:
  - `file`: Resume file (`.pdf`, `.docx`, or `.txt`, max 10MB)
  - `targetJobDescription`: (Optional) Text of target job description
- **Response** (200 OK):
  ```json
  {
    "id": "673dfa400f2e02613d99d104",
    "fileName": "Alex_Rivera_Resume.pdf",
    "candidateName": "Alex Rivera",
    "candidateEmail": "alex@university.edu",
    "candidatePhone": "+1 (555) 234-5678",
    "professionalSummary": "Aspiring software professional...",
    "technicalSkills": ["Java", "React", "Spring Boot", "SQL", "Git"],
    "softSkills": ["Problem Solving", "Team Collaboration"],
    "atsScore": 82.0,
    "atsScoreBreakdown": {
      "structureScore": 25,
      "contactScore": 15,
      "impactScore": 18,
      "keywordScore": 24
    },
    "identifiedMissingSkills": ["Docker", "CI/CD", "Redis"],
    "improvementSuggestions": [
      "Add measurable impact metrics to project bullet points.",
      "Incorporate cloud deployment keywords."
    ],
    "uploadedAt": "2026-11-19T06:35:00Z"
  }
  ```

### Get User Resumes
- **Endpoint**: `GET /api/resumes`
- **Access**: Bearer Token

### Update Extracted Resume Information
- **Endpoint**: `PUT /api/resumes/{id}`
- **Access**: Bearer Token (Owner only)

### Re-analyze Resume Against Target Job Description
- **Endpoint**: `POST /api/resumes/{id}/analyze`
- **Access**: Bearer Token
- **Request Body**:
  ```json
  {
    "jobDescription": "Looking for Senior Java Developer with Kubernetes and Kafka..."
  }
  ```

---

## 4. Interview Session & 5-Question Batch APIs

### Initialize Interview Session
- **Endpoint**: `POST /api/interviews`
- **Access**: Bearer Token
- **Request Body**:
  ```json
  {
    "jobRole": "Full Stack Developer",
    "targetSkills": ["Java", "React", "Spring Boot", "MongoDB"],
    "difficulty": "Intermediate",
    "category": "Mixed",
    "mode": "voice",
    "totalQuestions": 15,
    "resumeId": "673dfa400f2e02613d99d104"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "id": "673dfb120f2e02613d99d106",
    "jobRole": "Full Stack Developer",
    "targetSkills": ["Java", "React", "Spring Boot", "MongoDB"],
    "difficulty": "Intermediate",
    "category": "Mixed",
    "mode": "voice",
    "totalQuestions": 15,
    "totalBatches": 3,
    "currentBatchNumber": 1,
    "status": "IN_PROGRESS",
    "overallScore": 0.0,
    "createdAt": "2026-11-19T06:40:00Z"
  }
  ```

### Retrieve 5-Question Batch
- **Endpoint**: `GET /api/interviews/{id}/batch/{batchNumber}`
- **Access**: Bearer Token
- **Response** (200 OK):
  ```json
  {
    "batchId": "673dfb200f2e02613d99d108",
    "interviewId": "673dfb120f2e02613d99d106",
    "batchNumber": 1,
    "totalBatches": 3,
    "questions": [
      {
        "id": "q_1_1",
        "questionNumber": 1,
        "text": "Can you walk me through core memory management and garbage collection in Java?",
        "category": "Mixed",
        "type": "conceptual",
        "targetSkill": "Java",
        "difficulty": "Intermediate",
        "evaluationHints": "Candidate should explain memory regions, generational GC, and object lifecycle."
      },
      {
        "id": "q_1_2",
        "questionNumber": 2,
        "text": "How do you design RESTful APIs to ensure idempotency and backwards compatibility?",
        "category": "Mixed",
        "type": "technical",
        "targetSkill": "REST Architecture",
        "difficulty": "Intermediate",
        "evaluationHints": "Look for PUT vs PATCH, idempotency keys, and semantic HTTP status codes."
      },
      {
        "id": "q_1_3",
        "questionNumber": 3,
        "text": "In a recent project you built, what was the most challenging technical decision regarding database indexing?",
        "category": "Mixed",
        "type": "project",
        "targetSkill": "Database Management",
        "difficulty": "Intermediate",
        "evaluationHints": "Look for concrete latency vs write throughput trade-off analysis."
      },
      {
        "id": "q_1_4",
        "questionNumber": 4,
        "text": "How would you detect, diagnose, and resolve a slow query bottleneck in MongoDB or PostgreSQL?",
        "category": "Mixed",
        "type": "problem-solving",
        "targetSkill": "Performance Tuning",
        "difficulty": "Intermediate",
        "evaluationHints": "Should mention explain plans, compound indexes, and connection pools."
      },
      {
        "id": "q_1_5",
        "questionNumber": 5,
        "text": "Tell me about a time when a critical requirement changed shortly before a project deadline.",
        "category": "Mixed",
        "type": "behavioral",
        "targetSkill": "Adaptability & Teamwork",
        "difficulty": "easy",
        "evaluationHints": "Structured STAR response demonstrating constructive resolution."
      }
    ],
    "isSubmitted": false,
    "batchScore": 0.0
  }
  ```

### Submit 5-Question Batch
- **Endpoint**: `POST /api/interviews/{id}/submit-batch`
- **Access**: Bearer Token
- **Request Body**:
  ```json
  {
    "batchNumber": 1,
    "answers": [
      {
        "questionId": "q_1_1",
        "questionText": "Can you walk me through...",
        "answer": "Java memory is divided into Heap and Metaspace/Stack. Heap contains Young and Old generations...",
        "isSkipped": false
      },
      {
        "questionId": "q_1_2",
        "questionText": "How do you design RESTful APIs...",
        "answer": "Idempotent methods like GET, PUT, DELETE produce the same result regardless of repeat calls...",
        "isSkipped": false
      },
      {
        "questionId": "q_1_3",
        "questionText": "In a recent project...",
        "answer": "In my e-commerce project, I created compound indexes on userId and orderDate...",
        "isSkipped": false
      },
      {
        "questionId": "q_1_4",
        "questionText": "How would you detect...",
        "answer": "I run explain() to check COLLSCAN vs IXSCAN and inspect executionTimeMillis...",
        "isSkipped": false
      },
      {
        "questionId": "q_1_5",
        "questionText": "Tell me about a time...",
        "answer": "During our capstone project, our mentor asked for OAuth2 support 3 days before submission...",
        "isSkipped": false
      }
    ]
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "interviewId": "673dfb120f2e02613d99d106",
    "batchNumber": 1,
    "totalBatches": 3,
    "batchScore": 84.5,
    "batchSummary": "Strong demonstration of core principles with clear reasoning.",
    "isInterviewComplete": false,
    "nextBatchAvailable": true,
    "runningOverallScore": 84.5,
    "evaluations": [
      {
        "questionId": "q_1_1",
        "score": 88.0,
        "rubricScores": {
          "relevance": 18.0,
          "technicalAccuracy": 18.0,
          "completeness": 17.0,
          "clarity": 18.0,
          "depthOfExplanation": 17.0
        },
        "whatWasDoneWell": "Effective articulation of memory regions and garbage collection.",
        "missingConcepts": ["Escape analysis and G1 GC ergonomics"],
        "areasForImprovement": "Mention generational throughput vs pause time trade-offs.",
        "suggestedBetterAnswer": "A comprehensive answer covers Heap, Metaspace, GC roots, and G1/ZGC low latency collectors."
      }
    ]
  }
  ```

---

## 5. Performance Report & Analytics APIs

### Retrieve Final Report
- **Endpoint**: `GET /api/reports/{interviewId}`
- **Access**: Bearer Token
- **Response** (200 OK): Returns overall score, readiness tier (Interview Ready, Exceptional), question evaluations, skill scores, missing concepts, and actionable study roadmap.

### Dashboard Statistics
- **Endpoint**: `GET /api/analytics/dashboard`
- **Access**: Bearer Token
- **Response** (200 OK): Returns total interviews completed, average score, latest ATS score, skill performance bars, areas for improvement, and recent sessions.
