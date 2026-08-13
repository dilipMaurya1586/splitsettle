package com.splitsettle.settlementservice.controller;
import com.splitsettle.settlementservice.dto.BalanceResponse;
import com.splitsettle.settlementservice.dto.SettlementResponse;
import com.splitsettle.settlementservice.entity.SettlementTransaction;
import com.splitsettle.settlementservice.service.SettlementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settlements")
public class SettlementController {

    private final SettlementService settlementService;

    public SettlementController(SettlementService settlementService) {
        this.settlementService = settlementService;
    }

    @GetMapping("/group/{groupId}/balances")
    public ResponseEntity<List<BalanceResponse>> getBalances(@PathVariable Long groupId) {
        return ResponseEntity.ok(settlementService.getBalances(groupId));
    }

    // triggers the debt-simplification algorithm and returns the minimal transaction set
    @PostMapping("/group/{groupId}/calculate")
    public ResponseEntity<List<SettlementResponse>> calculateSettlement(@PathVariable Long groupId) {
        return ResponseEntity.ok(settlementService.calculateSettlement(groupId));
    }

    @GetMapping("/group/{groupId}/pending")
    public ResponseEntity<List<SettlementTransaction>> getPending(@PathVariable Long groupId) {
        return ResponseEntity.ok(settlementService.getPendingTransactions(groupId));
    }

    @PostMapping("/{transactionId}/settle")
    public ResponseEntity<Void> markSettled(@PathVariable Long transactionId) {
        settlementService.markSettled(transactionId);
        return ResponseEntity.ok().build();
    }
}
