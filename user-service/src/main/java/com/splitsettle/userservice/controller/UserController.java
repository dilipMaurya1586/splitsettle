package com.splitsettle.userservice.controller;

import com.splitsettle.userservice.dto.UserSummary;
import com.splitsettle.userservice.entity.User;
import com.splitsettle.userservice.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Used by the frontend's "Add member" flow: given an email, resolve the
    // userId + fullName that group-service needs to add them to a group.
    @GetMapping("/lookup")
    public UserSummary lookupByEmail(@RequestParam String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "No SplitSettle user is registered with this email"));
        return new UserSummary(user.getId(), user.getEmail(), user.getFullName());
    }
}