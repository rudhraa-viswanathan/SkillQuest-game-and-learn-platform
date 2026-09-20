package com.rudhraa.skillquest.dto;

public class UserProgressResponseDTO {

    private Long courseId;
    private String courseName;
    private int completedActivities;
    private int totalActivities;
    private double progressPercentage;

    public UserProgressResponseDTO() {
    }

    public UserProgressResponseDTO(
            Long courseId,
            String courseName,
            int completedActivities,
            int totalActivities,
            double progressPercentage) {

        this.courseId = courseId;
        this.courseName = courseName;
        this.completedActivities = completedActivities;
        this.totalActivities = totalActivities;
        this.progressPercentage = progressPercentage;
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

    public int getCompletedActivities() {
        return completedActivities;
    }

    public void setCompletedActivities(int completedActivities) {
        this.completedActivities = completedActivities;
    }

    public int getTotalActivities() {
        return totalActivities;
    }

    public void setTotalActivities(int totalActivities) {
        this.totalActivities = totalActivities;
    }

    public double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }
}