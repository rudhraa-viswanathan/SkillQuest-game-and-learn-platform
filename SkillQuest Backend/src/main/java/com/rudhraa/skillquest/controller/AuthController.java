package com.rudhraa.skillquest.controller;

import com.rudhraa.skillquest.dto.LoginRequestDTO;
import com.rudhraa.skillquest.dto.LoginResponseDTO;
import com.rudhraa.skillquest.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public LoginResponseDTO login(
            @Valid @RequestBody LoginRequestDTO loginRequestDTO) {

        return authenticationService.login(loginRequestDTO);
    }
}