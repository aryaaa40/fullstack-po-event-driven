package com.example.SpringEventDriven.service;

import com.example.SpringEventDriven.dto.request.DepartmentRequest;
import com.example.SpringEventDriven.dto.response.DepartmentResponse;

import java.util.List;

public interface DepartmentService {

    List<DepartmentResponse> getAll();

    DepartmentResponse getById(Long id);

    DepartmentResponse create(DepartmentRequest request);

    DepartmentResponse update(Long id, DepartmentRequest request);

    void delete(Long id);
}
