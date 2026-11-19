package com.preporbit.controller;

import com.preporbit.dto.ResumeDTOs;
import com.preporbit.security.UserPrincipal;
import com.preporbit.service.ResumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ResumeDTOs.ResumeUploadResponse> uploadResume(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "targetJobDescription", required = false) String targetJobDescription
    ) {
        return ResponseEntity.ok(resumeService.uploadAndAnalyze(userPrincipal.getId(), file, targetJobDescription));
    }

    @GetMapping
    public ResponseEntity<List<ResumeDTOs.ResumeUploadResponse>> getUserResumes(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(resumeService.getUserResumes(userPrincipal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeDTOs.ResumeUploadResponse> getResumeById(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(resumeService.getResumeById(id, userPrincipal.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResumeDTOs.ResumeUploadResponse> updateResume(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody ResumeDTOs.ResumeUpdateRequest request
    ) {
        return ResponseEntity.ok(resumeService.updateResume(id, userPrincipal.getId(), request));
    }

    @PostMapping("/{id}/analyze")
    public ResponseEntity<ResumeDTOs.ResumeUploadResponse> reanalyzeResume(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, String> body
    ) {
        String jobDescription = body.getOrDefault("jobDescription", "");
        return ResponseEntity.ok(resumeService.reanalyzeResume(id, userPrincipal.getId(), jobDescription));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteResume(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        resumeService.deleteResume(id, userPrincipal.getId());
        return ResponseEntity.ok(Map.of("message", "Resume successfully deleted"));
    }
}
