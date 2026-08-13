package com.splitsettle.groupservice.repository;
import com.splitsettle.groupservice.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {
    List<Group> findByCreatedByUserId(Long userId);
}
