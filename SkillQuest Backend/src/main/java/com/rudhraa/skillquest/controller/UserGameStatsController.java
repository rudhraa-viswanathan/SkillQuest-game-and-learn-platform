package com.rudhraa.skillquest.controller;

import com.rudhraa.skillquest.dto.UserGameStatsResponseDTO;
import com.rudhraa.skillquest.service.UserGameStatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.rudhraa.skillquest.dto.ActivityProgressResponseDTO;
import com.rudhraa.skillquest.dto.ActivityResultDTO;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/game-stats")
public class UserGameStatsController {

    private final UserGameStatsService userGameStatsService;

    public UserGameStatsController(
            UserGameStatsService userGameStatsService) {

        this.userGameStatsService = userGameStatsService;
    }

    @GetMapping
    public ResponseEntity<UserGameStatsResponseDTO> getMyGameStats() {

        UserGameStatsResponseDTO response =
                userGameStatsService.getMyGameStats();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/energy")
    public ResponseEntity<UserGameStatsResponseDTO> getEnergyStatus() {

        UserGameStatsResponseDTO response =
                userGameStatsService.getMyGameStats();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/attempt")
    public ResponseEntity<UserGameStatsResponseDTO> startAttempt() {

        userGameStatsService.consumeEnergy();

        UserGameStatsResponseDTO response =
                userGameStatsService.getMyGameStats();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/result")
    public ResponseEntity<ActivityProgressResponseDTO> submitResult(
            @Valid @RequestBody ActivityResultDTO resultDTO) {

        ActivityProgressResponseDTO response =
                userGameStatsService.processActivityResult(resultDTO);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/energy/buy")
    public ResponseEntity<UserGameStatsResponseDTO> buyEnergy() {

        UserGameStatsResponseDTO response =
                userGameStatsService.buyEnergy();

        return ResponseEntity.ok(response);
    }
}