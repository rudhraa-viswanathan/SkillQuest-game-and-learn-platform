package com.rudhraa.skillquest.repository;

import com.rudhraa.skillquest.entity.ActivityQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityQuestionRepository
        extends JpaRepository<ActivityQuestion, Long> {

    List<ActivityQuestion> findByActivityIdOrderByOrderIndexAsc(Long activityId);
}