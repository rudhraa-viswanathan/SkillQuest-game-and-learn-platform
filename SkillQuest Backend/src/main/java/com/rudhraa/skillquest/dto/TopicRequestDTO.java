package com.rudhraa.skillquest.dto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TopicRequestDTO {

    @NotBlank(message = "Topic name is required")
    @Size(min = 2, max = 100, message = "Topic name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Topic description is required")
    @Size(min = 5, max = 500, message = "Topic description must be between 5 and 500 characters")
    private String description;

    @NotNull(message = "Topic order is required")
    @Min(value = 1, message = "Topic order must be at least 1")
    private Integer orderIndex;

    public TopicRequestDTO() {
    }

    public TopicRequestDTO(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
}