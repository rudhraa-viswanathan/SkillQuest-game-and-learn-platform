package com.rudhraa.skillquest.service;

import com.rudhraa.skillquest.entity.User;
import com.rudhraa.skillquest.exception.ResourceNotFoundException;
import com.rudhraa.skillquest.repository.BadgeRepository;
import com.rudhraa.skillquest.repository.CourseRepository;
import com.rudhraa.skillquest.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.rudhraa.skillquest.entity.MilestoneType;
import com.rudhraa.skillquest.entity.Course;
import com.rudhraa.skillquest.entity.Badge;
import java.time.LocalDateTime;
import com.rudhraa.skillquest.dto.BadgeResponseDTO;
import java.util.List;

@Service
public class BadgeService {

    private final BadgeRepository badgeRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public BadgeService(
            BadgeRepository badgeRepository,
            UserRepository userRepository,
            CourseRepository courseRepository) {

        this.badgeRepository = badgeRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with username: " + username
                        )
                );
    }

    private boolean hasReachedMilestone(
            double progressPercentage,
            MilestoneType milestone) {

        return switch (milestone) {

            case MILESTONE_25 ->
                    progressPercentage >= 25;

            case MILESTONE_50 ->
                    progressPercentage >= 50;

            case MILESTONE_75 ->
                    progressPercentage >= 75;

            case MILESTONE_100 ->
                    progressPercentage >= 100;
        };
    }

    private boolean hasBadge(
            User user,
            Course course,
            MilestoneType milestone) {

        return badgeRepository.existsByUserAndCourseAndMilestone(
                user,
                course,
                milestone
        );
    }

    private void awardBadge(
            User user,
            Course course,
            MilestoneType milestone) {

        if (hasBadge(user, course, milestone)) {
            return;
        }

        Badge badge = new Badge();
        badge.setUser(user);
        badge.setCourse(course);
        badge.setMilestone(milestone);
        badge.setEarnedAt(LocalDateTime.now());

        badgeRepository.save(badge);
    }

    private void award25PercentBadge(
            User user,
            Course course,
            double progressPercentage) {

        if (hasReachedMilestone(
                progressPercentage,
                MilestoneType.MILESTONE_25)) {

            awardBadge(
                    user,
                    course,
                    MilestoneType.MILESTONE_25
            );
        }
    }

    private void award50PercentBadge(
            User user,
            Course course,
            double progressPercentage) {

        if (hasReachedMilestone(
                progressPercentage,
                MilestoneType.MILESTONE_50)) {

            awardBadge(
                    user,
                    course,
                    MilestoneType.MILESTONE_50
            );
        }
    }

    private void award75PercentBadge(
            User user,
            Course course,
            double progressPercentage) {

        if (hasReachedMilestone(
                progressPercentage,
                MilestoneType.MILESTONE_75)) {

            awardBadge(
                    user,
                    course,
                    MilestoneType.MILESTONE_75
            );
        }
    }

    private void award100PercentBadge(
            User user,
            Course course,
            double progressPercentage) {

        if (hasReachedMilestone(
                progressPercentage,
                MilestoneType.MILESTONE_100)) {

            awardBadge(
                    user,
                    course,
                    MilestoneType.MILESTONE_100
            );
        }
    }

    public void checkAndAwardMilestones(
            User user,
            Course course,
            double progressPercentage) {

        award25PercentBadge(user, course, progressPercentage);
        award50PercentBadge(user, course, progressPercentage);
        award75PercentBadge(user, course, progressPercentage);
        award100PercentBadge(user, course, progressPercentage);
    }

    private BadgeResponseDTO mapToResponseDTO(Badge badge) {

        return new BadgeResponseDTO(
                badge.getId(),
                badge.getCourse().getId(),
                badge.getCourse().getName(),
                badge.getMilestone(),
                badge.getEarnedAt()
        );
    }

    public List<BadgeResponseDTO> getMyBadges() {

        User user = getCurrentUser();

        return badgeRepository.findByUser(user)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public List<BadgeResponseDTO> getMyCourseBadges(Long courseId) {

        User user = getCurrentUser();

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Course not found with ID: " + courseId
                        )
                );

        return badgeRepository.findByUserAndCourse(user, course)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

}