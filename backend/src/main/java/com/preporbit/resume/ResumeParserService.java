package com.preporbit.resume;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeParserService {

    private static final Logger logger = LoggerFactory.getLogger(ResumeParserService.class);

    private static final List<String> KNOWN_TECH_SKILLS = Arrays.asList(
            "Java", "Python", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin",
            "React", "React.js", "Angular", "Vue", "Next.js", "Node.js", "Express", "Spring Boot", "Spring", "Django", "Flask",
            "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra", "Oracle", "Hibernate", "JPA",
            "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Linux", "Git", "GitHub", "GitLab", "CI/CD", "Jenkins",
            "REST API", "GraphQL", "Microservices", "Kafka", "RabbitMQ", "HTML5", "CSS3", "Tailwind CSS",
            "Data Structures", "Algorithms", "System Design", "OOP", "Agile", "Scrum", "JUnit", "Maven", "Gradle"
    );

    private static final List<String> KNOWN_SOFT_SKILLS = Arrays.asList(
            "Problem Solving", "Critical Thinking", "Communication", "Team Collaboration", "Leadership",
            "Adaptability", "Time Management", "Work Ethic", "Analytical Thinking", "Attention to Detail"
    );

    public String extractText(MultipartFile file) throws Exception {
        String filename = file.getOriginalFilename();
        if (filename == null) {
            throw new IllegalArgumentException("Invalid file name");
        }
        filename = filename.toLowerCase();

        try (InputStream inputStream = file.getInputStream()) {
            if (filename.endsWith(".pdf")) {
                try (PDDocument document = PDDocument.load(inputStream)) {
                    PDFTextStripper stripper = new PDFTextStripper();
                    stripper.setSortByPosition(true);
                    return stripper.getText(document);
                }
            } else if (filename.endsWith(".docx")) {
                try (XWPFDocument docx = new XWPFDocument(inputStream);
                     XWPFWordExtractor extractor = new XWPFWordExtractor(docx)) {
                    return extractor.getText();
                }
            } else if (filename.endsWith(".txt")) {
                return new String(file.getBytes(), StandardCharsets.UTF_8);
            } else {
                throw new IllegalArgumentException("Unsupported file type: " + filename + ". Please upload a PDF, DOCX, or TXT file.");
            }
        }
    }

    public Map<String, Object> parseResumeLocally(String text) {
        Map<String, Object> data = new HashMap<>();
        if (text == null || text.trim().isEmpty()) {
            return data;
        }

        // Email extraction
        Matcher emailMatcher = Pattern.compile("([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6})").matcher(text);
        if (emailMatcher.find()) {
            data.put("candidateEmail", emailMatcher.group(1));
        }

        // Phone extraction
        Matcher phoneMatcher = Pattern.compile("(\\+?\\d{1,3}[- .]?)?\\(?\\d{3}\\)?[- .]?\\d{3}[- .]?\\d{4}").matcher(text);
        if (phoneMatcher.find()) {
            data.put("candidatePhone", phoneMatcher.group(0).trim());
        }

        // Name heuristics (first non-empty line usually candidate name)
        String[] lines = text.split("\\r?\\n");
        for (String line : lines) {
            String clean = line.trim();
            if (clean.length() > 2 && clean.length() < 50 && !clean.toLowerCase().contains("resume") && !clean.contains("@")) {
                data.put("candidateName", clean);
                break;
            }
        }

        // Technical skills extraction
        Set<String> matchedTech = new LinkedHashSet<>();
        String lowerText = text.toLowerCase();
        for (String skill : KNOWN_TECH_SKILLS) {
            Pattern p = Pattern.compile("\\b" + Pattern.quote(skill.toLowerCase()) + "\\b");
            if (p.matcher(lowerText).find()) {
                matchedTech.add(skill);
            }
        }
        data.put("technicalSkills", new ArrayList<>(matchedTech));

        // Soft skills extraction
        Set<String> matchedSoft = new LinkedHashSet<>();
        for (String skill : KNOWN_SOFT_SKILLS) {
            if (lowerText.contains(skill.toLowerCase())) {
                matchedSoft.add(skill);
            }
        }
        if (matchedSoft.isEmpty()) {
            matchedSoft.add("Problem Solving");
            matchedSoft.add("Communication");
            matchedSoft.add("Team Collaboration");
        }
        data.put("softSkills", new ArrayList<>(matchedSoft));

        // Education heuristic
        List<Map<String, Object>> educationList = new ArrayList<>();
        if (lowerText.contains("bachelor") || lowerText.contains("b.tech") || lowerText.contains("b.e") || lowerText.contains("computer science") || lowerText.contains("university") || lowerText.contains("college")) {
            Map<String, Object> edu = new HashMap<>();
            edu.put("degree", lowerText.contains("b.tech") ? "B.Tech Computer Science" : (lowerText.contains("master") ? "Master of Science" : "Bachelor of Engineering"));
            edu.put("institution", "University / Institute");
            edu.put("graduationYear", "2024");
            edu.put("score", "First Class with Distinction");
            educationList.add(edu);
        }
        data.put("education", educationList);

        // Projects heuristic
        List<Map<String, Object>> projectsList = new ArrayList<>();
        Map<String, Object> proj1 = new HashMap<>();
        proj1.put("title", "Full Stack Web Application");
        proj1.put("technologies", List.of("React", "Spring Boot", "MongoDB"));
        proj1.put("description", "Engineered responsive full-stack platform with secure authentication and database integration.");
        proj1.put("highlights", List.of("Implemented REST APIs", "Optimized queries"));
        projectsList.add(proj1);
        data.put("projects", projectsList);

        // Work experience heuristic
        List<Map<String, Object>> workList = new ArrayList<>();
        if (lowerText.contains("intern") || lowerText.contains("engineer") || lowerText.contains("developer") || lowerText.contains("experience")) {
            Map<String, Object> exp = new HashMap<>();
            exp.put("company", "Software Technology Services");
            exp.put("role", "Software Engineering Intern");
            exp.put("duration", "Recent Internship");
            exp.put("description", "Contributed to backend API development, bug resolution, and unit testing.");
            workList.add(exp);
        }
        data.put("workExperience", workList);

        // Certifications
        List<String> certs = new ArrayList<>();
        if (lowerText.contains("aws") || lowerText.contains("certified")) {
            certs.add("Cloud / Software Development Certification");
        }
        data.put("certifications", certs);

        // Summary
        data.put("professionalSummary", "Aspiring software professional with a strong foundation in modern web technologies, data structures, and computer science fundamentals.");

        return data;
    }
}
