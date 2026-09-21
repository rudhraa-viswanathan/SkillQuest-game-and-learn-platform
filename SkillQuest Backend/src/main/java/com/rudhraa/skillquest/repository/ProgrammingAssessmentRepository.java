package com.rudhraa.skillquest.repository;

import com.rudhraa.skillquest.entity.Course;
import com.rudhraa.skillquest.entity.ProgrammingAssessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProgrammingAssessmentRepository
        extends JpaRepository<ProgrammingAssessment, Long> {

    Optional<ProgrammingAssessment> findByCourse(Course course);

    boolean existsByCourse(Course course);
}