package com.splitsettle.groupservice.service;
import com.splitsettle.groupservice.dto.AddMemberRequest;
import com.splitsettle.groupservice.dto.CreateGroupRequest;
import com.splitsettle.groupservice.dto.GroupResponse;
import com.splitsettle.groupservice.entity.Group;
import com.splitsettle.groupservice.entity.GroupMember;
import com.splitsettle.groupservice.repository.GroupMemberRepository;
import com.splitsettle.groupservice.repository.GroupRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final com.splitsettle.groupservice.service.GroupEventPublisher eventPublisher;

    public GroupService(GroupRepository groupRepository, GroupMemberRepository groupMemberRepository,
                         com.splitsettle.groupservice.service.GroupEventPublisher eventPublisher) {
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public GroupResponse createGroup(CreateGroupRequest request, Long creatorUserId, String creatorEmail, String creatorName) {
        Group group = new Group();
        group.setName(request.name());
        group.setDescription(request.description());
        group.setCreatedByUserId(creatorUserId);

        Group saved = groupRepository.save(group);

        // creator is auto-added as the first member
        GroupMember creator = new GroupMember();
        creator.setGroup(saved);
        creator.setUserId(creatorUserId);
        creator.setUserEmail(creatorEmail);
        creator.setUserFullName(creatorName);
        groupMemberRepository.save(creator);

        saved.getMembers().add(creator);
        return GroupResponse.from(saved);
    }

    @Transactional
    public GroupResponse addMember(Long groupId, AddMemberRequest request) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found"));

        if (groupMemberRepository.existsByGroupIdAndUserId(groupId, request.userId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already a member of this group");
        }

        GroupMember member = new GroupMember();
        member.setGroup(group);
        member.setUserId(request.userId());
        member.setUserEmail(request.userEmail());
        member.setUserFullName(request.userFullName());
        groupMemberRepository.save(member);

        eventPublisher.publishMemberAdded(groupId, request.userId(), request.userEmail());

        // 🛑 Yeh change karo (Refreshed group ki jagah directly ID se fetch karo)
        Group refreshed = groupRepository.findById(groupId).orElseThrow();
        return GroupResponse.from(refreshed);
        //
//        Group refreshed = groupRepository.findById(groupId).orElseThrow();
//        return GroupResponse.from(refreshed);
    }

    public GroupResponse getGroup(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found"));
        return GroupResponse.from(group);
    }

    public List<GroupResponse> getGroupsForUser(Long userId) {
        return groupMemberRepository.findByUserId(userId).stream()
                .map(gm -> getGroup(gm.getGroup().getId()))
                .toList();
    }

    public void verifyMembership(Long groupId, Long userId) {
        if (!groupMemberRepository.existsByGroupIdAndUserId(groupId, userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not a member of this group");
        }
    }
}
