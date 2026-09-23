package com.rudhraa.skillquest.controller;

import com.rudhraa.skillquest.dto.UserRequestDTO;
import com.rudhraa.skillquest.dto.UserResponseDTO;
import com.rudhraa.skillquest.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserResponseDTO registerUser(
            @Valid @RequestBody UserRequestDTO userRequestDTO) {

        return userService.registerUser(userRequestDTO);
    }

    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserResponseDTO getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}")
    public UserResponseDTO updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRequestDTO userRequestDTO) {

        return userService.updateUser(
                id,
                userRequestDTO
        );
    }


    @DeleteMapping("/{id}")
    public String deleteUser(
            @PathVariable Long id) {

        userService.deleteUser(id);

        return "User deleted successfully";
    }

    @PutMapping("/{id}/restriction")
    public UserResponseDTO setUserRestriction(
            @PathVariable Long id,
            @RequestParam boolean restricted) {

        return userService.setUserRestriction(
                id,
                restricted
        );
    }

}