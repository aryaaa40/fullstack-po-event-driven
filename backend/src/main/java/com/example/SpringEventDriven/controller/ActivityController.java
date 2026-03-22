package com.example.SpringEventDriven.controller;

import com.example.SpringEventDriven.dto.response.ApiResponse;
import com.example.SpringEventDriven.dto.response.ApprovalHistoryResponse;
import com.example.SpringEventDriven.entity.User;
import com.example.SpringEventDriven.service.ApprovalHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activity")
@RequiredArgsConstructor
public class ActivityController {

    private final ApprovalHistoryService approvalHistoryService;

    @GetMapping("/recent")
    @PreAuthorize("hasAnyRole('REQUESTER', 'MANAGER', 'FINANCE')")
    public ResponseEntity<ApiResponse<List<ApprovalHistoryResponse>>> getRecentActivity(
            @AuthenticationPrincipal User currentUser) {

        List<ApprovalHistoryResponse> result = approvalHistoryService.getRecentActivity(currentUser);
        return ResponseEntity.ok(ApiResponse.success(200, "Recent activity retrieved successfully", result));
    }
}
