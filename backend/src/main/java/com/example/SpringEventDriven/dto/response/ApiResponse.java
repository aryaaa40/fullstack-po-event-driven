package com.example.SpringEventDriven.dto.response;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonPropertyOrder({"status", "message", "data"})
public class ApiResponse<T> {

    private int status;
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(int status, String message, T data) {
        return ApiResponse.<T>builder()
                .status(status)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> error(int status, String message) {
        return ApiResponse.<T>builder()
                .status(status)
                .message(message)
                .data(null)
                .build();
    }
}
