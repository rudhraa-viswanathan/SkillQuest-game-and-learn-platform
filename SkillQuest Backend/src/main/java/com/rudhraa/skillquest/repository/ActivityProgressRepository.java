package com.rudhraa.skillquest.repository;
import com.rudhraa.skillquest.entity.Topic;
import com.rudhraa.skillquest.entity.Course;
import com.rudhraa.skillquest.entity.Activity;
import com.rudhraa.skillquest.entity.ActivityProgress;
import com.rudhraa.skillquest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ActivityProgressRepository
        extends JpaRepository<ActivityProgress, Long> {

    Optional<ActivityProgress> findByUserAndActivity(
            User user,
            Activity activity
    );

    boolean existsByUserAndActivityAndCompletedTrue(
            User user,
            Activity activity
    );

    long countByUserAndCompletedTrueAndActivity_Topic_Course(
            User user,
            Course course
    );

    long countByUserAndCompletedTrueAndActivity_Topic(
            User user,
            Topic topic
    );
}