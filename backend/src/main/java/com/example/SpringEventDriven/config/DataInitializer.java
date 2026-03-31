package com.example.SpringEventDriven.config;

import com.example.SpringEventDriven.entity.Budget;
import com.example.SpringEventDriven.entity.Department;
import com.example.SpringEventDriven.entity.Role;
import com.example.SpringEventDriven.entity.User;
import com.example.SpringEventDriven.repository.BudgetRepository;
import com.example.SpringEventDriven.repository.DepartmentRepository;
import com.example.SpringEventDriven.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final BudgetRepository budgetRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        // 1. Seed Departments
        if (departmentRepository.count() == 0) {
            List<Department> departments = List.of(
                    Department.builder().name("Engineering").code("ENG").description("Software & IT Engineering").build(),
                    Department.builder().name("Finance").code("FIN").description("Finance & Accounting").build(),
                    Department.builder().name("Human Resources").code("HR").description("HR & People Operations").build(),
                    Department.builder().name("Marketing").code("MKT").description("Marketing & Communications").build(),
                    Department.builder().name("Operations").code("OPS").description("Business Operations").build(),
                    Department.builder().name("Logistics").code("LOG").description("Supply Chain & Logistics").build()
            );
            departmentRepository.saveAll(departments);
            log.info("Seeded 6 departments");
        }

        // 1b. Seed Budget for Engineering (to allow demo POs)
        Department eng = departmentRepository.findByCode("ENG").orElse(null);
        if (eng != null) {
            int currentYear = LocalDate.now().getYear();
            boolean hasBudget = budgetRepository.findByDepartmentIdAndFiscalYearAndFiscalMonthIsNull(eng.getId(), currentYear).isPresent();
            if (!hasBudget) {
                budgetRepository.save(Budget.builder()
                        .department(eng)
                        .fiscalYear(currentYear)
                        .totalAmount(new java.math.BigDecimal("1000000000")) // 1 Miliar
                        .createdBy("SYSTEM")
                        .build());
                log.info("Seeded 1 Miliar budget for ENG department for year {}", currentYear);
            }
        }

        // 2. Seed Demo Users
        seedUser("requesterpub", "requester@example.com", "requester123", Role.REQUESTER, "ENG");
        seedUser("managerpub", "manager@example.com", "manager123", Role.MANAGER, "ENG");
        seedUser("financepub", "finance@example.com", "finance123", Role.FINANCE, "FIN");
    }

    private void seedUser(String username, String email, String password, Role role, String deptCode) {
        Department dept = departmentRepository.findByCode(deptCode).orElse(null);
        
        userRepository.findByUsername(username).ifPresentOrElse(
            (existingUser) -> {
                // Update department jika berbeda (agar demo flow lancar)
                if (existingUser.getDepartment() == null || !existingUser.getDepartment().getCode().equals(deptCode)) {
                    existingUser.setDepartment(dept);
                    userRepository.save(existingUser);
                    log.info("Updated existing user department: {} to {}", username, deptCode);
                }
            },
            () -> {
                // Buat baru jika belum ada
                User user = User.builder()
                        .username(username)
                        .email(email)
                        .password(passwordEncoder.encode(password))
                        .role(role)
                        .department(dept)
                        .build();
                userRepository.save(user);
                log.info("Seeded new user: {} with role: {}", username, role);
            }
        );
    }
}
