package com.rudhraa.skillquest.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_progress")
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private int completedActivities = 0;

    @Column(nullable = false)
    private int totalActivities = 0;

    @Column(nullable = false)
    private double progressPercentage = 0.0;

    public UserProgress() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
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