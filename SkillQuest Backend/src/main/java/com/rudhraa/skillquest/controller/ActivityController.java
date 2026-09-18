package com.rudhraa.skillquest.controller;

import com.rudhraa.skillquest.entity.Activity;
import com.rudhraa.skillquest.service.ActivityService;
import org.springframework.web.bind.annotation.*;
import com.rudhraa.skillquest.dto.ActivityRequestDTO;
import com.rudhraa.skillquest.dto.ActivityResponseDTO;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping("/topic/{topicId}")
    public ActivityResponseDTO createActivity(
            @PathVariable Long topicId,
            @RequestBody ActivityRequestDTO activityRequestDTO) {

        return activityService.saveActivity(topicId, activityRequestDTO);
    }

    @GetMapping
    public List<ActivityResponseDTO> getAllActivities() {
        return activityService.getAllActivities();
    }

    @GetMapping("/{id}")
    public ActivityResponseDTO getActivityById(@PathVariable Long id) {
        return activityService.getActivityById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public ActivityResponseDTO updateActivity(
            @PathVariable Long id,
            @RequestBody ActivityRequestDTO activityRequestDTO) {

        return activityService.updateActivity(id, activityRequestDTO);
    }

    @DeleteMapping("/{id}")
    public String deleteActivity(@PathVariable Long id) {

        activityService.deleteActivity(id);

        return "Activity deleted successfully";
    }
}