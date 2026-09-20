package com.rudhraa.skillquest.dto;

import com.rudhraa.skillquest.entity.MilestoneType;

import java.time.LocalDateTime;

public class BadgeResponseDTO {

    private Long id;
    private Long courseId;
    private String courseName;
    private MilestoneType milestone;
    private LocalDateTime earnedAt;

    public BadgeResponseDTO() {
    }

    public BadgeResponseDTO(
            Long id,
            Long courseId,
            String courseName,
            MilestoneType milestone,
            LocalDateTime earnedAt) {

        this.id = id;
        this.courseId = courseId;
        this.courseName = courseName;
        this.milestone = milestone;
        this.earnedAt = earnedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public MilestoneType getMilestone() {
        return milestone;
    }

    public void setMilestone(MilestoneType milestone) {
        this.milestone = milestone;
    }

    public LocalDateTime getEarnedAt() {
        return earnedAt;
    }

    public void setEarnedAt(LocalDateTime earnedAt) {
        this.earnedAt = earnedAt;
    }
}