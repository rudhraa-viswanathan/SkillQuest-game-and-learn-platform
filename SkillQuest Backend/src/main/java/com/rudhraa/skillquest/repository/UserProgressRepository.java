package com.rudhraa.skillquest.repository;

import com.rudhraa.skillquest.entity.Course;
import com.rudhraa.skillquest.entity.User;
import com.rudhraa.skillquest.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProgressRepository
        extends JpaRepository<UserProgress, Long> {

    Optional<UserProgress> findByUserAndCourse(
            User user,
            Course course
    );
}