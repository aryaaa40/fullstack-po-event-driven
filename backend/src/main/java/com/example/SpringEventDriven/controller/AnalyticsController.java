package com.example.SpringEventDriven.controller;

import com.example.SpringEventDriven.dto.response.AnalyticsDTO;
import com.example.SpringEventDriven.entity.User;
import com.example.SpringEventDriven.repository.UserRepository;
import com.example.SpringEventDriven.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<AnalyticsDTO> getDashboardAnalytics(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(analyticsService.getDashboardAnalytics(user));
    }
}
