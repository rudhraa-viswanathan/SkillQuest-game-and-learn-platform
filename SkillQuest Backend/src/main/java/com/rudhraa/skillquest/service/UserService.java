package com.rudhraa.skillquest.service;
import com.rudhraa.skillquest.repository.UserRepository;
import com.rudhraa.skillquest.dto.UserRequestDTO;
import com.rudhraa.skillquest.dto.UserResponseDTO;
import com.rudhraa.skillquest.entity.Role;
import com.rudhraa.skillquest.entity.User;
import org.springframework.stereotype.Service;
import java.util.List;
import com.rudhraa.skillquest.exception.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private User mapToEntity(UserRequestDTO userRequestDTO) {

        User user = new User();

        user.setUsername(userRequestDTO.getUsername());
        user.setEmail(userRequestDTO.getEmail());
        user.setPassword(
                passwordEncoder.encode(userRequestDTO.getPassword())
        );

        user.setRole(Role.USER);

        return user;
    }

    private UserResponseDTO mapToResponseDTO(User user) {

        UserResponseDTO userResponseDTO = new UserResponseDTO();

        userResponseDTO.setId(user.getId());
        userResponseDTO.setUsername(user.getUsername());
        userResponseDTO.setEmail(user.getEmail());
        userResponseDTO.setRole(user.getRole());
        userResponseDTO.setRestricted(user.isRestricted());

        return userResponseDTO;
    }

    public UserResponseDTO registerUser(UserRequestDTO userRequestDTO) {

        if (userRepository.existsByUsername(userRequestDTO.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (userRepository.existsByEmail(userRequestDTO.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = mapToEntity(userRequestDTO);

        User savedUser = userRepository.save(user);

        return mapToResponseDTO(savedUser);
    }

    public List<UserResponseDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public UserResponseDTO getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + id
                        )
                );

        return mapToResponseDTO(user);
    }

    public UserResponseDTO updateUser(
            Long id,
            UserRequestDTO userRequestDTO) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + id
                        )
                );

        user.setUsername(userRequestDTO.getUsername());
        user.setEmail(userRequestDTO.getEmail());

        // Only change password if a new password was provided
        if (userRequestDTO.getPassword() != null &&
                !userRequestDTO.getPassword().isBlank()) {

            user.setPassword(
                    passwordEncoder.encode(
                            userRequestDTO.getPassword()
                    )
            );
        }

        User updatedUser = userRepository.save(user);

        return mapToResponseDTO(updatedUser);
    }


    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + id
                        )
                );

        userRepository.delete(user);
    }

    public UserResponseDTO setUserRestriction(
            Long id,
            boolean restricted) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + id
                        )
                );

        user.setRestricted(restricted);

        User updatedUser = userRepository.save(user);

        return mapToResponseDTO(updatedUser);
    }

}