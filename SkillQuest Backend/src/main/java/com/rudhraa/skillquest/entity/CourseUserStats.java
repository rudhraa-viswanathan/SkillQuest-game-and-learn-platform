package com.rudhraa.skillquest.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "course_user_stats")
public class CourseUserStats {

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
    private int courseXp = 0;

    public CourseUserStats() {
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

    public int getCourseXp() {
        return courseXp;
    }

    public void setCourseXp(int courseXp) {
        this.courseXp = courseXp;
    }
}