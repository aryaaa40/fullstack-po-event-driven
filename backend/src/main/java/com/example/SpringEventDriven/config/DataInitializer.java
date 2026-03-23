package com.example.SpringEventDriven.config;

import com.example.SpringEventDriven.entity.Department;
import com.example.SpringEventDriven.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final DepartmentRepository departmentRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (departmentRepository.count() > 0) return;

        List<Department> departments = List.of(
                Department.builder().name("Engineering").code("ENG").description("Software & IT Engineering").build(),
                Department.builder().name("Finance").code("FIN").description("Finance & Accounting").build(),
                Department.builder().name("Human Resources").code("HR").description("HR & People Operations").build(),
                Department.builder().name("Marketing").code("MKT").description("Marketing & Communications").build(),
                Department.builder().name("Operations").code("OPS").description("Business Operations").build(),
                Department.builder().name("Logistics").code("LOG").description("Supply Chain & Logistics").build()
        );

        departmentRepository.saveAll(departments);
        log.info("Seeded {} departments", departments.size());
    }
}
