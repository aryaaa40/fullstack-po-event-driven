package com.example.SpringEventDriven.service;

import com.example.SpringEventDriven.dto.request.LoginRequest;
import com.example.SpringEventDriven.dto.request.RegisterRequest;
import com.example.SpringEventDriven.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}