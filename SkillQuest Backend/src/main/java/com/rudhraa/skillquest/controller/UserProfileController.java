package com.rudhraa.skillquest.controller;

import com.rudhraa.skillquest.entity.User;
import com.rudhraa.skillquest.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
@RequestMapping("/api/users")
public class UserProfileController {

    private final UserRepository userRepository;


    public UserProfileController(
            UserRepository userRepository) {

        this.userRepository =
                userRepository;
    }


    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            Authentication authentication) {

        User user =
                userRepository
                        .findByUsername(
                                authentication.getName()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        return ResponseEntity.ok(
                Map.of(
                        "username",
                        user.getUsername(),
                        "role",
                        user.getRole().name()
                )
        );
    }
}