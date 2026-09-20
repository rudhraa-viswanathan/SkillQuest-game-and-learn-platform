package com.rudhraa.skillquest.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ActivityResultDTO {

    @NotNull(message = "Activity ID is required")
    private Long activityId;

    @NotNull(message = "Score percentage is required")
    @Min(value = 0, message = "Score percentage cannot be less than 0")
    @Max(value = 100, message = "Score percentage cannot be greater than 100")
    private Integer scorePercentage;

    public ActivityResultDTO() {
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Integer getScorePercentage() {
        return scorePercentage;
    }

    public void setScorePercentage(Integer scorePercentage) {
        this.scorePercentage = scorePercentage;
    }
}