package com.rudhraa.skillquest.repository;

import com.rudhraa.skillquest.entity.Badge;
import com.rudhraa.skillquest.entity.Course;
import com.rudhraa.skillquest.entity.MilestoneType;
import com.rudhraa.skillquest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BadgeRepository extends JpaRepository<Badge, Long> {

    boolean existsByUserAndCourseAndMilestone(
            User user,
            Course course,
            MilestoneType milestone
    );

    List<Badge> findByUser(User user);

    List<Badge> findByUserAndCourse(User user, Course course);
}