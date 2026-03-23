package com.example.SpringEventDriven.dto.response;

import com.example.SpringEventDriven.entity.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String tokenType;
    private Long expiresIn;
    private UserInfo user;

    @Data
    @Builder
    public static class UserInfo {
        private Long id;
        private String username;
        private String email;
        private Role role;
        private Long departmentId;
        private String departmentName;
    }
}
