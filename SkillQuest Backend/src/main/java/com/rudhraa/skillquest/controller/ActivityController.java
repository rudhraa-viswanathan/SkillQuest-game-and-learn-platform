package com.rudhraa.skillquest.controller;

import com.rudhraa.skillquest.dto.ActivityRequestDTO;
import com.rudhraa.skillquest.dto.ActivityResponseDTO;
import com.rudhraa.skillquest.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(
            ActivityService activityService) {

        this.activityService = activityService;
    }


    // =====================================================
    // CREATE ACTIVITY
    // =====================================================

    @PostMapping("/topic/{topicId}")
    public ActivityResponseDTO createActivity(
            @PathVariable Long topicId,
            @Valid @RequestBody
            ActivityRequestDTO activityRequestDTO) {

        return activityService.saveActivity(
                topicId,
                activityRequestDTO
        );
    }


    // =====================================================
    // GET ALL ACTIVITIES
    // =====================================================

    @GetMapping
    public List<ActivityResponseDTO> getAllActivities() {

        return activityService.getAllActivities();
    }


    // =====================================================
    // GET ACTIVITIES BY TOPIC
    // =====================================================

    @GetMapping("/topic/{topicId}")
    public List<ActivityResponseDTO> getActivitiesByTopic(
            @PathVariable Long topicId) {

        return activityService.getActivitiesByTopic(
                topicId
        );
    }


    // =====================================================
    // GET ACTIVITY BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ActivityResponseDTO getActivityById(
            @PathVariable Long id) {

        return activityService.getActivityById(id);
    }


    // =====================================================
    // UPDATE ACTIVITY
    // =====================================================

    @PutMapping("/{id}")
    public ActivityResponseDTO updateActivity(
            @PathVariable Long id,
            @Valid @RequestBody
            ActivityRequestDTO activityRequestDTO) {

        return activityService.updateActivity(
                id,
                activityRequestDTO
        );
    }


    // =====================================================
    // DELETE ACTIVITY
    // =====================================================

    @DeleteMapping("/{id}")
    public String deleteActivity(
            @PathVariable Long id) {

        activityService.deleteActivity(id);

        return "Activity deleted successfully";
    }

}