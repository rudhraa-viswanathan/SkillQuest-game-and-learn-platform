package com.rudhraa.skillquest.dto;

public class TopicProgressResponseDTO {

    private Long topicId;
    private String topicName;
    private int orderIndex;
    private long completedActivities;
    private long totalActivities;
    private boolean completed;
    private boolean unlocked;

    public TopicProgressResponseDTO() {
    }

    public TopicProgressResponseDTO(
            Long topicId,
            String topicName,
            int orderIndex,
            long completedActivities,
            long totalActivities,
            boolean completed,
            boolean unlocked) {

        this.topicId = topicId;
        this.topicName = topicName;
        this.orderIndex = orderIndex;
        this.completedActivities = completedActivities;
        this.totalActivities = totalActivities;
        this.completed = completed;
        this.unlocked = unlocked;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public long getCompletedActivities() {
        return completedActivities;
    }

    public void setCompletedActivities(long completedActivities) {
        this.completedActivities = completedActivities;
    }

    public long getTotalActivities() {
        return totalActivities;
    }

    public void setTotalActivities(long totalActivities) {
        this.totalActivities = totalActivities;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public boolean isUnlocked() {
        return unlocked;
    }

    public void setUnlocked(boolean unlocked) {
        this.unlocked = unlocked;
    }
}