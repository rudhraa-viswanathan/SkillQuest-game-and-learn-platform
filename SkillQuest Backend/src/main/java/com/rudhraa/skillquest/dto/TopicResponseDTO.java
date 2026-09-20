package com.rudhraa.skillquest.dto;

public class TopicResponseDTO {

    private Long id;
    private String name;
    private String description;
    private Long courseId;
    private int orderIndex;

    public TopicResponseDTO() {
    }

    public TopicResponseDTO(
            Long id,
            String name,
            String description,
            Long courseId,
            int orderIndex) {

        this.id = id;
        this.name = name;
        this.description = description;
        this.courseId = courseId;
        this.orderIndex = orderIndex;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }
}