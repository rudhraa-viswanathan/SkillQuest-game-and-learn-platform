package com.rudhraa.skillquest.dto;

public class CourseRequestDTO {

    private String name;
    private String description;

    public CourseRequestDTO() {
    }

    public CourseRequestDTO(String name, String description) {
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
}