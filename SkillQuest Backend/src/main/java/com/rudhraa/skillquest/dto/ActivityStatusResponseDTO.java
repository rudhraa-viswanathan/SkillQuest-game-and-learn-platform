package com.rudhraa.skillquest.dto;

public class ActivityStatusResponseDTO {

    private Long activityId;
    private String activityTitle;
    private Integer orderIndex;
    private boolean completed;
    private boolean unlocked;


    public ActivityStatusResponseDTO(
            Long activityId,
            String activityTitle,
            Integer orderIndex,
            boolean completed,
            boolean unlocked) {

        this.activityId = activityId;
        this.activityTitle = activityTitle;
        this.orderIndex = orderIndex;
        this.completed = completed;
        this.unlocked = unlocked;
    }


    public Long getActivityId() {
        return activityId;
    }

    public String getActivityTitle() {
        return activityTitle;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public boolean isCompleted() {
        return completed;
    }

    public boolean isUnlocked() {
        return unlocked;
    }
}