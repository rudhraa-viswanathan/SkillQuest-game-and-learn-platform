package com.rudhraa.skillquest.controller;

import com.rudhraa.skillquest.dto.ActivityProgressResponseDTO;
import com.rudhraa.skillquest.service.UserProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.rudhraa.skillquest.dto.UserProgressResponseDTO;
import com.rudhraa.skillquest.dto.TopicProgressResponseDTO;
import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class UserProgressController {

    private final UserProgressService userProgressService;

    public UserProgressController(
            UserProgressService userProgressService) {

        this.userProgressService = userProgressService;
    }

    @PostMapping("/activities/{activityId}/complete")
    public ResponseEntity<ActivityProgressResponseDTO> completeActivity(
            @PathVariable Long activityId) {

        ActivityProgressResponseDTO response =
                userProgressService.completeActivity(activityId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<UserProgressResponseDTO> getCourseProgress(
            @PathVariable Long courseId) {

        UserProgressResponseDTO response =
                userProgressService.getCourseProgress(courseId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/courses/{courseId}/topics")
    public ResponseEntity<List<TopicProgressResponseDTO>> getTopicProgress(
            @PathVariable Long courseId) {

        List<TopicProgressResponseDTO> response =
                userProgressService.getTopicProgress(courseId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/users/{userId}")
    public ResponseEntity<List<UserProgressResponseDTO>>
    getUserProgressForAdmin(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                userProgressService
                        .getUserProgressForAdmin(userId)
        );
    }


    @DeleteMapping("/admin/users/{userId}/courses/{courseId}")
    public ResponseEntity<Void> resetUserCourseProgress(
            @PathVariable Long userId,
            @PathVariable Long courseId) {

        userProgressService.resetUserCourseProgress(
                userId,
                courseId
        );

        return ResponseEntity.noContent().build();
    }

}