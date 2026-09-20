package com.rudhraa.skillquest.repository;
import com.rudhraa.skillquest.entity.Course;
import com.rudhraa.skillquest.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import com.rudhraa.skillquest.entity.Topic;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    long countByTopic_Course(Course course);

    long countByTopic(Topic topic);

}