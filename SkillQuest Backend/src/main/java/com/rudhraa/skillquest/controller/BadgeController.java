package com.rudhraa.skillquest.controller;

import com.rudhraa.skillquest.dto.BadgeResponseDTO;
import com.rudhraa.skillquest.service.BadgeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/badges")
public class BadgeController {

    private final BadgeService badgeService;

    public BadgeController(BadgeService badgeService) {
        this.badgeService = badgeService;
    }

    @GetMapping
    public ResponseEntity<List<BadgeResponseDTO>> getMyBadges() {

        return ResponseEntity.ok(
                badgeService.getMyBadges()
        );
    }

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<List<BadgeResponseDTO>> getMyCourseBadges(
            @PathVariable Long courseId) {

        return ResponseEntity.ok(
                badgeService.getMyCourseBadges(courseId)
        );
    }
}