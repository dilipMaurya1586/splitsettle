package com.splitsettle.settlementservice.service;
import com.splitsettle.settlementservice.entity.Balance;
import com.splitsettle.settlementservice.repository.BalanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;

@Service
public class BalanceService {

    private final BalanceRepository balanceRepository;

    public BalanceService(BalanceRepository balanceRepository) {
        this.balanceRepository = balanceRepository;
    }

    @Transactional
    public void adjustBalance(Long groupId, Long userId, BigDecimal delta) {
        Balance balance = balanceRepository.findByGroupIdAndUserId(groupId, userId)
                .orElseGet(() -> {
                    Balance b = new Balance();
                    b.setGroupId(groupId);
                    b.setUserId(userId);
                    b.setNetBalance(BigDecimal.ZERO);
                    return b;
                });

        balance.setNetBalance(balance.getNetBalance().add(delta));
        balance.setUpdatedAt(Instant.now());
        balanceRepository.save(balance);
    }
}
