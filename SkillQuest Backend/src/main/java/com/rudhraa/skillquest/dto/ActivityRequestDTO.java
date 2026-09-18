package com.rudhraa.skillquest.dto;

import com.rudhraa.skillquest.entity.ActivityType;

public class ActivityRequestDTO {

    private String title;
    private String description;
    private ActivityType type;

    public ActivityRequestDTO() {
    }

    public ActivityRequestDTO(
            String title,
            String description,
            ActivityType type) {

        this.title = title;
        this.description = description;
        this.type = type;
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
}