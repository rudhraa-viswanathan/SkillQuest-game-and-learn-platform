package com.rudhraa.skillquest.repository;

import com.rudhraa.skillquest.entity.Course;
import com.rudhraa.skillquest.entity.CourseUserStats;
import com.rudhraa.skillquest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseUserStatsRepository
        extends JpaRepository<CourseUserStats, Long> {

    Optional<CourseUserStats> findByUserAndCourse(
            User user,
            Course course
    );

    List<CourseUserStats> findByCourse(
            Course course
    );
}