package com.splitsettle.expenseservice.controller;

import com.splitsettle.expenseservice.dto.CreateExpenseRequest;
import com.splitsettle.expenseservice.dto.ExpenseResponse;
import com.splitsettle.expenseservice.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(@Valid @RequestBody CreateExpenseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(expenseService.createExpense(request));
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<ExpenseResponse>> getExpensesForGroup(@PathVariable Long groupId) {
        return ResponseEntity.ok(expenseService.getExpensesForGroup(groupId));
    }

    @GetMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponse> getExpense(@PathVariable Long expenseId) {
        return ResponseEntity.ok(expenseService.getExpense(expenseId));
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long expenseId) {
        expenseService.deleteExpense(expenseId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponse> updateExpense(@PathVariable Long expenseId, @Valid @RequestBody CreateExpenseRequest request) {
        return ResponseEntity.ok(expenseService.updateExpense(expenseId, request));
    }
}
