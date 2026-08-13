package com.splitsettle.groupservice.controller;


import com.splitsettle.groupservice.dto.AddMemberRequest;
import com.splitsettle.groupservice.dto.CreateGroupRequest;
import com.splitsettle.groupservice.dto.GroupResponse;
import com.splitsettle.groupservice.security.AuthenticatedUser;
import com.splitsettle.groupservice.service.GroupService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping
    public ResponseEntity<GroupResponse> createGroup(@Valid @RequestBody CreateGroupRequest request,
                                                     @AuthenticationPrincipal AuthenticatedUser user) {
        GroupResponse response = groupService.createGroup(request, user.userId(), user.email(), user.email());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{groupId}/members")
    public ResponseEntity<GroupResponse> addMember(@PathVariable Long groupId,
                                                     @Valid @RequestBody AddMemberRequest request,
                                                     @AuthenticationPrincipal AuthenticatedUser user) {
        groupService.verifyMembership(groupId, user.userId());
        return ResponseEntity.ok(groupService.addMember(groupId, request));
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<GroupResponse> getGroup(@PathVariable Long groupId,
                                                    @AuthenticationPrincipal AuthenticatedUser user) {
        groupService.verifyMembership(groupId, user.userId());
        return ResponseEntity.ok(groupService.getGroup(groupId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<GroupResponse>> getMyGroups(@AuthenticationPrincipal AuthenticatedUser user) {
        return ResponseEntity.ok(groupService.getGroupsForUser(user.userId()));
    }
}
