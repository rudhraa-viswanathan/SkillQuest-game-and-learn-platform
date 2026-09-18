package com.rudhraa.skillquest.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.rudhraa.skillquest.entity.ActivityType;

public class ActivityRequestDTO {

    @NotBlank(message = "Activity title is required")
    @Size(min = 2, max = 150, message = "Activity title must be between 2 and 150 characters")
    private String title;

    @NotBlank(message = "Activity description is required")
    @Size(min = 5, max = 500, message = "Activity description must be between 5 and 500 characters")
    private String description;

    @NotNull(message = "Activity type is required")
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