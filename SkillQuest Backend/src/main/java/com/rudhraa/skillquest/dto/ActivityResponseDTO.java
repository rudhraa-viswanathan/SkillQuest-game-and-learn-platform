package com.rudhraa.skillquest.dto;

import com.rudhraa.skillquest.entity.ActivityType;

public class ActivityResponseDTO {

    private Long id;
    private String title;
    private String description;
    private ActivityType type;
    private Long topicId;

    public ActivityResponseDTO() {
    }

    public ActivityResponseDTO(
            Long id,
            String title,
            String description,
            ActivityType type,
            Long topicId) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.topicId = topicId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ActivityType getType() {
        return type;
    }

    public void setType(ActivityType type) {
        this.type = type;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }
}