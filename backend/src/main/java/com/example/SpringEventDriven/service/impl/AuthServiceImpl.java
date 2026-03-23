package com.example.SpringEventDriven.service.impl;

import com.example.SpringEventDriven.config.JwtService;
import com.example.SpringEventDriven.dto.request.LoginRequest;
import com.example.SpringEventDriven.dto.request.RegisterRequest;
import com.example.SpringEventDriven.dto.response.AuthResponse;
import com.example.SpringEventDriven.entity.Department;
import com.example.SpringEventDriven.entity.Role;
import com.example.SpringEventDriven.entity.User;
import com.example.SpringEventDriven.repository.DepartmentRepository;
import com.example.SpringEventDriven.repository.UserRepository;
import com.example.SpringEventDriven.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username sudah digunakan");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email sudah digunakan");
        }

        // REQUESTER dan MANAGER wajib punya department, FINANCE tidak
        Department department = null;
        boolean needsDepartment = request.getRole() == Role.REQUESTER || request.getRole() == Role.MANAGER;

        if (needsDepartment) {
            if (request.getDepartmentId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Department is required for REQUESTER and MANAGER");
            }
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Department not found"));
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .department(department)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);

        return buildAuthResponse(token, user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        String token = jwtService.generateToken(user);

        return buildAuthResponse(token, user);
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        Department dept = user.getDepartment();
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpiration())
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .departmentId(dept != null ? dept.getId() : null)
                        .departmentName(dept != null ? dept.getName() : null)
                        .build())
                .build();
    }
}
