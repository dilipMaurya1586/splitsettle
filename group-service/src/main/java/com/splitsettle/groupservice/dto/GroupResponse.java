package com.splitsettle.groupservice.dto;
import com.splitsettle.groupservice.entity.Group;
import java.time.Instant;
import java.util.List;

public record GroupResponse(
        Long id,
        String name,
        String description,
        Long createdByUserId,
        Instant createdAt,
        List<MemberInfo> members
) {
    public record MemberInfo(Long userId, String email, String fullName) {}

    public static GroupResponse from(Group group) {
        List<MemberInfo> memberInfos = group.getMembers().stream()
                .map(m -> new MemberInfo(m.getUserId(), m.getUserEmail(), m.getUserFullName()))
                .toList();
        return new GroupResponse(group.getId(), group.getName(), group.getDescription(),
                group.getCreatedByUserId(), group.getCreatedAt(), memberInfos);
    }
}
