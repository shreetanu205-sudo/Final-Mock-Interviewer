package com.preporbit.controller;

import com.preporbit.dto.InterviewDTOs;
import com.preporbit.security.UserPrincipal;
import com.preporbit.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping
    public ResponseEntity<InterviewDTOs.InterviewSummaryResponse> createInterview(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody InterviewDTOs.CreateInterviewRequest request
    ) {
        return ResponseEntity.ok(interviewService.createInterview(userPrincipal.getId(), request));
    }

    @GetMapping
    public ResponseEntity<List<InterviewDTOs.InterviewSummaryResponse>> getUserInterviews(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(interviewService.getUserInterviews(userPrincipal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewDTOs.InterviewSummaryResponse> getInterviewById(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(interviewService.getInterviewById(id, userPrincipal.getId()));
    }

    @GetMapping("/{id}/batch/{batchNumber}")
    public ResponseEntity<InterviewDTOs.BatchResponse> getBatch(
            @PathVariable String id,
            @PathVariable int batchNumber,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(interviewService.getBatch(id, userPrincipal.getId(), batchNumber));
    }

    @PostMapping("/{id}/generate-batch")
    public ResponseEntity<InterviewDTOs.BatchResponse> generateBatch(
            @PathVariable String id,
            @RequestParam(value = "batchNumber", defaultValue = "1") int batchNumber,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(interviewService.getBatch(id, userPrincipal.getId(), batchNumber));
    }

    @PostMapping("/{id}/submit-batch")
    public ResponseEntity<InterviewDTOs.BatchEvaluationResponse> submitBatch(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody InterviewDTOs.SubmitBatchRequest request
    ) {
        return ResponseEntity.ok(interviewService.submitBatch(id, userPrincipal.getId(), request));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<InterviewDTOs.InterviewSummaryResponse> completeInterview(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(interviewService.completeInterview(id, userPrincipal.getId()));
    }
}
