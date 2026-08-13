package com.splitsettle.settlementservice.repository;
import com.splitsettle.settlementservice.entity.SettlementTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SettlementTransactionRepository extends JpaRepository<SettlementTransaction, Long> {
    List<SettlementTransaction> findByGroupIdAndStatus(Long groupId, SettlementTransaction.Status status);
    List<SettlementTransaction> findByGroupId(Long groupId);
    void deleteByGroupIdAndStatus(Long groupId, SettlementTransaction.Status status);
}
