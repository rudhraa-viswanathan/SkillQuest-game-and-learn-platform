package com.rudhraa.skillquest.controller;
import jakarta.validation.Valid;
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
            @Valid @RequestBody ActivityRequestDTO activityRequestDTO) {

        return activityService.saveActivity(topicId, activityRequestDTO);
    }

    @GetMapping
    public List<ActivityResponseDTO> getAllActivities() {
        return activityService.getAllActivities();
    }

    @GetMapping("/{id}")
    public ActivityResponseDTO getActivityById(@PathVariable Long id) {
        return activityService.getActivityById(id);
    }

    @PutMapping("/{id}")
    public ActivityResponseDTO updateActivity(
            @PathVariable Long id,
            @Valid @RequestBody ActivityRequestDTO activityRequestDTO) {

        return activityService.updateActivity(id, activityRequestDTO);
    }

    @DeleteMapping("/{id}")
    public String deleteActivity(@PathVariable Long id) {

        activityService.deleteActivity(id);

        return "Activity deleted successfully";
    }
}