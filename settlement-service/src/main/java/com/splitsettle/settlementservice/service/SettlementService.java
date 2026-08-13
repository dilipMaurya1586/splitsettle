package com.splitsettle.settlementservice.service;
import com.splitsettle.settlementservice.algorithm.DebtSimplifier;
import com.splitsettle.settlementservice.dto.BalanceResponse;
import com.splitsettle.settlementservice.dto.SettlementResponse;
import com.splitsettle.settlementservice.entity.Balance;
import com.splitsettle.settlementservice.entity.SettlementTransaction;
import com.splitsettle.settlementservice.repository.BalanceRepository;
import com.splitsettle.settlementservice.repository.SettlementTransactionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
public class SettlementService {

    private final BalanceRepository balanceRepository;
    private final SettlementTransactionRepository transactionRepository;
    private final DebtSimplifier debtSimplifier;

    public SettlementService(BalanceRepository balanceRepository,
                              SettlementTransactionRepository transactionRepository,
                              DebtSimplifier debtSimplifier) {
        this.balanceRepository = balanceRepository;
        this.transactionRepository = transactionRepository;
        this.debtSimplifier = debtSimplifier;
    }

    public List<BalanceResponse> getBalances(Long groupId) {
        return balanceRepository.findByGroupId(groupId).stream()
                .map(b -> new BalanceResponse(b.getUserId(), b.getNetBalance()))
                .toList();
    }

    /**
     * Runs the debt-simplification algorithm on current balances and
     * persists the resulting minimal transaction set as PENDING.
     */
    @Transactional
    public List<SettlementResponse> calculateSettlement(Long groupId) {
        List<Balance> balances = balanceRepository.findByGroupId(groupId);

        // clear old pending transactions before recalculating
        transactionRepository.deleteByGroupIdAndStatus(groupId, SettlementTransaction.Status.PENDING);

        List<DebtSimplifier.SimplifiedTransaction> simplified = debtSimplifier.simplify(balances);

        List<SettlementTransaction> toSave = simplified.stream().map(s -> {
            SettlementTransaction tx = new SettlementTransaction();
            tx.setGroupId(groupId);
            tx.setFromUserId(s.fromUserId());
            tx.setToUserId(s.toUserId());
            tx.setAmount(s.amount());
            tx.setStatus(SettlementTransaction.Status.PENDING);
            return tx;
        }).toList();

        transactionRepository.saveAll(toSave);

        return simplified.stream()
                .map(s -> new SettlementResponse(s.fromUserId(), s.toUserId(), s.amount()))
                .toList();
    }

    @Transactional
    public void markSettled(Long transactionId) {
        SettlementTransaction tx = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));
        tx.setStatus(SettlementTransaction.Status.SETTLED);
        tx.setSettledAt(Instant.now());
        transactionRepository.save(tx);
    }

    public List<SettlementTransaction> getPendingTransactions(Long groupId) {
        return transactionRepository.findByGroupIdAndStatus(groupId, SettlementTransaction.Status.PENDING);
    }
}
