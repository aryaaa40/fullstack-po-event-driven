package com.example.SpringEventDriven.service;

import com.example.SpringEventDriven.dto.request.BudgetRequest;
import com.example.SpringEventDriven.dto.response.BudgetResponse;
import com.example.SpringEventDriven.dto.response.BudgetUtilizationResponse;
import com.example.SpringEventDriven.entity.User;

import java.util.List;

public interface BudgetService {

    // CRUD — hanya Finance
    BudgetResponse create(BudgetRequest request, User currentUser);

    BudgetResponse update(Long id, BudgetRequest request);

    void delete(Long id);

    List<BudgetResponse> getAll(Integer fiscalYear);

    // Utilization — Finance lihat semua dept, Manager/Requester lihat dept sendiri
    List<BudgetUtilizationResponse> getUtilization(Integer fiscalYear, User currentUser);
}
