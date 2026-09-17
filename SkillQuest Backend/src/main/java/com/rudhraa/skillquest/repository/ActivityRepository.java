package com.rudhraa.skillquest.repository;

import com.rudhraa.skillquest.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
}