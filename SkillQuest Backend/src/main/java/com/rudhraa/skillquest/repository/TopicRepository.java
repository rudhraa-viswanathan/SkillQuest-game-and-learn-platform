package com.rudhraa.skillquest.repository;

import com.rudhraa.skillquest.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicRepository extends JpaRepository<Topic, Long> {
}