package com.rudhraa.skillquest.controller;

import com.rudhraa.skillquest.dto.LeaderboardResponseDTO;
import com.rudhraa.skillquest.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(
            LeaderboardService leaderboardService) {

        this.leaderboardService = leaderboardService;
    }

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<List<LeaderboardResponseDTO>>
    getCourseLeaderboard(
            @PathVariable Long courseId) {

        return ResponseEntity.ok(
                leaderboardService
                        .getCourseLeaderboard(courseId)
        );
    }

    @GetMapping("/courses/{courseId}/me")
    public ResponseEntity<LeaderboardResponseDTO>
    getMyLeaderboardPosition(
            @PathVariable Long courseId) {

        LeaderboardResponseDTO position =
                leaderboardService
                        .getMyLeaderboardPosition(courseId);

        if (position == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(position);
    }
}