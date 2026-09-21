package com.rudhraa.skillquest.repository;

import com.rudhraa.skillquest.entity.AssessmentAttempt;
import com.rudhraa.skillquest.entity.ProgrammingAssessment;
import com.rudhraa.skillquest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentAttemptRepository
        extends JpaRepository<AssessmentAttempt, Long> {

    List<AssessmentAttempt> findByUserAndProgrammingAssessment(
            User user,
            ProgrammingAssessment programmingAssessment
    );

    boolean existsByUserAndProgrammingAssessmentAndPassedTrue(
            User user,
            ProgrammingAssessment programmingAssessment
    );
}