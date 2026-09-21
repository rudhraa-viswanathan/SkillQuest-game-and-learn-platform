package com.rudhraa.skillquest.service;

import com.rudhraa.skillquest.entity.User;
import com.rudhraa.skillquest.exception.ResourceNotFoundException;
import com.rudhraa.skillquest.repository.AssessmentAttemptRepository;
import com.rudhraa.skillquest.repository.CourseRepository;
import com.rudhraa.skillquest.repository.ProgrammingAssessmentRepository;
import com.rudhraa.skillquest.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.rudhraa.skillquest.dto.UserProgressResponseDTO;
import com.rudhraa.skillquest.dto.ProgrammingAssessmentResponseDTO;
import com.rudhraa.skillquest.entity.Course;
import com.rudhraa.skillquest.entity.ProgrammingAssessment;
import com.rudhraa.skillquest.dto.AssessmentSubmissionDTO;
import com.rudhraa.skillquest.dto.AssessmentAttemptResponseDTO;
import com.rudhraa.skillquest.entity.AssessmentAttempt;

import java.time.LocalDateTime;

@Service
public class ProgrammingAssessmentService {

    private static final int PASS_SCORE = 60;

    private final ProgrammingAssessmentRepository programmingAssessmentRepository;
    private final AssessmentAttemptRepository assessmentAttemptRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final UserProgressService userProgressService;

    public ProgrammingAssessmentService(
            ProgrammingAssessmentRepository programmingAssessmentRepository,
            AssessmentAttemptRepository assessmentAttemptRepository,
            CourseRepository courseRepository,
            UserRepository userRepository,
            UserProgressService userProgressService) {

        this.programmingAssessmentRepository = programmingAssessmentRepository;
        this.assessmentAttemptRepository = assessmentAttemptRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.userProgressService = userProgressService;
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    private UserProgressResponseDTO getCourseProgress(Long courseId) {
        return userProgressService.getCourseProgress(courseId);
    }

    private void validateAssessmentUnlocked(Long courseId) {

        UserProgressResponseDTO userProgress =
                getCourseProgress(courseId);

        if (userProgress.getProgressPercentage() < 75.0) {
            throw new IllegalStateException(
                    "Programming assessment unlocks at 75% course progress"
            );
        }
    }


    public ProgrammingAssessmentResponseDTO getAssessmentByCourse(
            Long courseId) {

        User user = getCurrentUser();

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course not found"));

        validateAssessmentUnlocked(courseId);

        ProgrammingAssessment assessment =
                programmingAssessmentRepository.findByCourse(course)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Programming assessment not found"
                                ));

        boolean passed =
                assessmentAttemptRepository
                        .existsByUserAndProgrammingAssessmentAndPassedTrue(
                                user,
                                assessment
                        );

        return new ProgrammingAssessmentResponseDTO(
                assessment.getId(),
                course.getId(),
                assessment.getTitle(),
                assessment.getProblemDescription(),
                passed
        );
    }

    private int calculateScore(
            String submittedAnswer,
            String expectedAnswer) {

        String normalizedSubmittedAnswer =
                normalizeCode(submittedAnswer);

        String normalizedExpectedAnswer =
                normalizeCode(expectedAnswer);

        if (normalizedSubmittedAnswer.equals(
                normalizedExpectedAnswer)) {

            return 100;
        }

        return 0;
    }


    private String normalizeCode(String code) {

        if (code == null) {
            return "";
        }

        return code
                .trim()

                // Normalize spaces/newlines/tabs
                .replaceAll("\\s+", " ")

                // Ignore spaces around Java punctuation
                .replaceAll("\\s*([{}();])\\s*", "$1")

                // Remove remaining spaces outside
                // string literals for this simple assessment
                .replaceAll(" +", " ");
    }

    public AssessmentAttemptResponseDTO submitAssessment(
            AssessmentSubmissionDTO submissionDTO) {

        User user = getCurrentUser();

        ProgrammingAssessment assessment =
                programmingAssessmentRepository
                        .findById(submissionDTO.getAssessmentId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Programming assessment not found"
                                ));

        Long courseId = assessment.getCourse().getId();

        validateAssessmentUnlocked(courseId);

        boolean alreadyPassed =
                assessmentAttemptRepository
                        .existsByUserAndProgrammingAssessmentAndPassedTrue(
                                user,
                                assessment
                        );

        if (alreadyPassed) {
            throw new IllegalStateException(
                    "Programming assessment already completed"
            );
        }

        int scorePercentage = calculateScore(
                submissionDTO.getAnswer(),
                assessment.getExpectedAnswer()
        );

        boolean passed = scorePercentage >= PASS_SCORE;

        AssessmentAttempt attempt = new AssessmentAttempt();

        attempt.setUser(user);
        attempt.setProgrammingAssessment(assessment);
        attempt.setScorePercentage(scorePercentage);
        attempt.setPassed(passed);
        attempt.setAttemptedAt(LocalDateTime.now());

        AssessmentAttempt savedAttempt =
                assessmentAttemptRepository.save(attempt);

        return new AssessmentAttemptResponseDTO(
                savedAttempt.getId(),
                savedAttempt.getScorePercentage(),
                savedAttempt.isPassed(),
                savedAttempt.getAttemptedAt()
        );
    }

}