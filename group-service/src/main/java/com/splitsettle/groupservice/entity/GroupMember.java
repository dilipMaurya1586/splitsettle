package com.splitsettle.groupservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Entity
@Table(name = "group_members", uniqueConstraints = @UniqueConstraint(columnNames = {"group_id", "user_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    @JsonIgnore
    private com.splitsettle.groupservice.entity.Group group;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    // denormalized for quick display without calling user-service every time
    private String userEmail;
    private String userFullName;

    private Instant joinedAt = Instant.now();
}
