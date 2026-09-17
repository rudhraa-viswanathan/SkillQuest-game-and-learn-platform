package com.rudhraa.skillquest.repository;

import com.rudhraa.skillquest.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
}