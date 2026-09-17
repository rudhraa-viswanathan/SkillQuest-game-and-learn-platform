package com.rudhraa.skillquest.controller;

import com.rudhraa.skillquest.entity.Activity;
import com.rudhraa.skillquest.service.ActivityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping("/topic/{topicId}")
    public Activity createActivity(
            @PathVariable Long topicId,
            @RequestBody Activity activity) {

        return activityService.saveActivity(topicId, activity);
    }

    @GetMapping
    public List<Activity> getAllActivities() {
        return activityService.getAllActivities();
    }

    @GetMapping("/{id}")
    public Activity getActivityById(@PathVariable Long id) {
        return activityService.getActivityById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Activity updateActivity(
            @PathVariable Long id,
            @RequestBody Activity activity) {

        return activityService.updateActivity(id, activity);
    }

    @DeleteMapping("/{id}")
    public String deleteActivity(@PathVariable Long id) {

        activityService.deleteActivity(id);

        return "Activity deleted successfully";
    }
}