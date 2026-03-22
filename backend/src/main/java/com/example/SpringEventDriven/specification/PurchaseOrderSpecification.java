package com.example.SpringEventDriven.specification;

import com.example.SpringEventDriven.entity.POCategory;
import com.example.SpringEventDriven.entity.POPriority;
import com.example.SpringEventDriven.entity.PurchaseOrder;
import com.example.SpringEventDriven.entity.PurchaseOrderStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class PurchaseOrderSpecification {

    public static Specification<PurchaseOrder> withFilters(
            String search,
            PurchaseOrderStatus status,
            POCategory category,
            POPriority priority,
            LocalDate dateFrom,
            LocalDate dateTo,
            boolean onlyForUser,
            Long userId) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Role-based: REQUESTER hanya lihat PO miliknya
            if (onlyForUser) {
                predicates.add(cb.equal(root.get("createdBy").get("id"), userId));
            }

            // Filter by status
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            // Filter by category
            if (category != null) {
                predicates.add(cb.equal(root.get("category"), category));
            }

            // Filter by priority
            if (priority != null) {
                predicates.add(cb.equal(root.get("priority"), priority));
            }

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("vendor")), pattern)
                ));
            }

            // Filter by date range (createdAt)
            if (dateFrom != null) {
                predicates.add(cb.greaterThanOrEqualTo(
                        root.get("createdAt"), dateFrom.atStartOfDay()));
            }
            if (dateTo != null) {
                predicates.add(cb.lessThan(
                        root.get("createdAt"), dateTo.plusDays(1).atStartOfDay()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
