package com.preporbit.controller;

import com.preporbit.dto.ReportDTOs;
import com.preporbit.security.UserPrincipal;
import com.preporbit.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public ResponseEntity<List<ReportDTOs.ReportResponse>> getUserReports(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(reportService.getUserReports(userPrincipal.getId()));
    }

    @GetMapping("/{interviewId}")
    public ResponseEntity<ReportDTOs.ReportResponse> getReportByInterviewId(
            @PathVariable String interviewId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(reportService.getReportByInterviewId(interviewId, userPrincipal.getId()));
    }

    @PostMapping("/{interviewId}/generate")
    public ResponseEntity<ReportDTOs.ReportResponse> generateReport(
            @PathVariable String interviewId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(reportService.generateReport(interviewId, userPrincipal.getId()));
    }
}
