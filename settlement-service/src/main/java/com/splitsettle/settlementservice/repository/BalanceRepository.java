package com.splitsettle.settlementservice.repository;
import com.splitsettle.settlementservice.entity.Balance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BalanceRepository extends JpaRepository<Balance, Long> {
    List<Balance> findByGroupId(Long groupId);
    Optional<Balance> findByGroupIdAndUserId(Long groupId, Long userId);
}
