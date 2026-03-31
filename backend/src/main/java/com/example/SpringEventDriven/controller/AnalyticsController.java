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
        String principal = authentication.getName();
        System.out.println("[AnalyticsController] Menerima request untuk: " + principal);
        
        // Coba cari berdasarkan username (karena token subject adalah username)
        // Jika gagal, coba berdasarkan email
        User user = userRepository.findByUsername(principal)
                .or(() -> userRepository.findByEmail(principal))
                .orElseThrow(() -> new RuntimeException("DEBUG_USER_NOT_FOUND: [" + principal + "]. Silakan Logout & Login ulang."));
        
        System.out.println("[AnalyticsController] User ditemukan: " + user.getUsername() + " | Role: " + user.getRole());
        return ResponseEntity.ok(analyticsService.getDashboardAnalytics(user));
    }
}
