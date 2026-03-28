package com.example.SpringEventDriven.controller;

import com.example.SpringEventDriven.dto.response.ApiResponse;
import com.example.SpringEventDriven.dto.response.NotificationResponse;
import com.example.SpringEventDriven.service.NotificationService;
import com.example.SpringEventDriven.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getMyNotifications(@AuthenticationPrincipal User currentUser) {
        List<NotificationResponse> notifications = notificationService.getNotificationsForUser(
                currentUser.getRole().name(),
                currentUser.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.<List<NotificationResponse>>builder()
                .status(200)
                .message("Notifications retrieved successfully")
                .data(notifications)
                .build());
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@AuthenticationPrincipal User currentUser) {
        notificationService.markAllAsRead(
                currentUser.getRole().name(),
                currentUser.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(200)
                .message("All notifications marked as read")
                .data(null)
                .build());
    }
}
