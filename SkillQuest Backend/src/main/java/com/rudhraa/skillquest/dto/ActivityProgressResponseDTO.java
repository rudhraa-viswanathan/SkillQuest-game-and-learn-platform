package com.rudhraa.skillquest.dto;

import java.time.LocalDateTime;

public class ActivityProgressResponseDTO {

    private Long activityId;
    private String activityTitle;
    private boolean completed;
    private LocalDateTime completedAt;

    public ActivityProgressResponseDTO() {
    }

    public ActivityProgressResponseDTO(
            Long activityId,
            String activityTitle,
            boolean completed,
            LocalDateTime completedAt) {

        this.activityId = activityId;
        this.activityTitle = activityTitle;
        this.completed = completed;
        this.completedAt = completedAt;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public String getActivityTitle() {
        return activityTitle;
    }

    public void setActivityTitle(String activityTitle) {
        this.activityTitle = activityTitle;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}