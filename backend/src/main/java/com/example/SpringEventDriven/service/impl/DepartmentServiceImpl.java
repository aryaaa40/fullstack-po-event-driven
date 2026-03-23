package com.example.SpringEventDriven.service.impl;

import com.example.SpringEventDriven.dto.request.DepartmentRequest;
import com.example.SpringEventDriven.dto.response.DepartmentResponse;
import com.example.SpringEventDriven.entity.Department;
import com.example.SpringEventDriven.repository.DepartmentRepository;
import com.example.SpringEventDriven.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAll() {
        return departmentRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Override
    public DepartmentResponse create(DepartmentRequest request) {
        if (departmentRepository.existsByCode(request.getCode().toUpperCase())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Department with code '" + request.getCode() + "' already exists");
        }
        Department dept = Department.builder()
                .name(request.getName())
                .code(request.getCode().toUpperCase())
                .description(request.getDescription())
                .build();
        return toResponse(departmentRepository.save(dept));
    }

    @Override
    public DepartmentResponse update(Long id, DepartmentRequest request) {
        Department dept = findOrThrow(id);

        // Cek duplikat code hanya jika code berubah
        String newCode = request.getCode().toUpperCase();
        if (!dept.getCode().equals(newCode) && departmentRepository.existsByCode(newCode)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Department with code '" + newCode + "' already exists");
        }

        dept.setName(request.getName());
        dept.setCode(newCode);
        dept.setDescription(request.getDescription());
        return toResponse(departmentRepository.save(dept));
    }

    @Override
    public void delete(Long id) {
        Department dept = findOrThrow(id);
        departmentRepository.delete(dept);
    }

    private Department findOrThrow(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Department not found"));
    }

    private DepartmentResponse toResponse(Department dept) {
        return DepartmentResponse.builder()
                .id(dept.getId())
                .name(dept.getName())
                .code(dept.getCode())
                .description(dept.getDescription())
                .createdAt(dept.getCreatedAt())
                .build();
    }
}
