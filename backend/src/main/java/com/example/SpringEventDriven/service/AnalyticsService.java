package com.example.SpringEventDriven.service;

import com.example.SpringEventDriven.dto.response.AnalyticsDTO;
import com.example.SpringEventDriven.entity.PurchaseOrderStatus;
import com.example.SpringEventDriven.entity.Role;
import com.example.SpringEventDriven.entity.User;
import com.example.SpringEventDriven.repository.PurchaseOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final PurchaseOrderRepository poRepository;

    @Transactional(readOnly = true)
    public AnalyticsDTO getDashboardAnalytics(User user) {
        boolean isFinance = user.getRole() == Role.FINANCE;
        Long deptId = (user.getDepartment() != null) ? user.getDepartment().getId() : null;

        if (!isFinance && deptId == null) {
            // Safe fallback 
            return AnalyticsDTO.builder()
                    .summary(AnalyticsDTO.SummaryData.builder()
                            .totalOrders(0).approvedOrders(0).totalSpend(BigDecimal.ZERO).build())
                    .categoryDistribution(java.util.Collections.emptyList())
                    .monthlyTrend(java.util.Collections.emptyList())
                    .build();
        }

        // 1. Summary Data
        AnalyticsDTO.SummaryData summary = buildSummary(isFinance, deptId);

        // 2. Category Distribution
        List<Object[]> categoryRaw = isFinance 
                ? poRepository.getSpendingByCategory() 
                : poRepository.getSpendingByCategoryAndDepartment(deptId);
        
        List<AnalyticsDTO.CategoryData> categoryData = categoryRaw.stream()
                .map(obj -> new AnalyticsDTO.CategoryData(String.valueOf(obj[0]), toBigDecimal(obj[1])))
                .collect(Collectors.toList());

        // 3. Monthly Trend
        List<Object[]> monthlyRaw = isFinance 
                ? poRepository.getMonthlySpendingTrend() 
                : poRepository.getMonthlySpendingTrendByDepartment(deptId);
        
        List<AnalyticsDTO.MonthlyData> monthlyData = monthlyRaw.stream()
                .map(obj -> new AnalyticsDTO.MonthlyData(String.valueOf(obj[0]), toBigDecimal(obj[1])))
                .collect(Collectors.toList());

        return AnalyticsDTO.builder()
                .summary(summary)
                .categoryDistribution(categoryData)
                .monthlyTrend(monthlyData)
                .build();
    }

    private AnalyticsDTO.SummaryData buildSummary(boolean isFinance, Long deptId) {
        long totalOrders = isFinance ? poRepository.count() : poRepository.countByDepartmentId(deptId);
        long approvedOrders = isFinance ? poRepository.countApprovedOrders() : poRepository.countApprovedOrdersByDepartment(deptId);
        
        BigDecimal totalSpend = isFinance 
                ? poRepository.sumTotalApprovedAmount() 
                : poRepository.sumAmountByDepartmentAndStatus(deptId, PurchaseOrderStatus.FINANCE_APPROVED);

        return AnalyticsDTO.SummaryData.builder()
                .totalOrders(totalOrders)
                .approvedOrders(approvedOrders)
                .totalSpend(totalSpend != null ? totalSpend : BigDecimal.ZERO)
                .build();
    }

    private BigDecimal toBigDecimal(Object obj) {
        if (obj == null) return BigDecimal.ZERO;
        if (obj instanceof BigDecimal) return (BigDecimal) obj;
        if (obj instanceof Number) return new BigDecimal(((Number) obj).toString());
        return BigDecimal.ZERO;
    }
}
