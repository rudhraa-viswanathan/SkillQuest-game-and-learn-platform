package com.rudhraa.skillquest.repository;

import com.rudhraa.skillquest.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import com.rudhraa.skillquest.entity.Course;
import java.util.List;

public interface TopicRepository extends JpaRepository<Topic, Long> {

    List<Topic> findByCourseOrderByOrderIndexAsc(Course course);
}