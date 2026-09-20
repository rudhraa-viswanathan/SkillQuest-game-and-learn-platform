package com.rudhraa.skillquest.service;

import com.rudhraa.skillquest.entity.Course;
import com.rudhraa.skillquest.entity.CourseUserStats;
import com.rudhraa.skillquest.repository.CourseRepository;
import com.rudhraa.skillquest.repository.CourseUserStatsRepository;
import org.springframework.stereotype.Service;
import com.rudhraa.skillquest.dto.LeaderboardResponseDTO;
import java.util.ArrayList;
import java.util.List;
import com.rudhraa.skillquest.entity.User;
import com.rudhraa.skillquest.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class LeaderboardService {

    private final CourseUserStatsRepository courseUserStatsRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;


    public LeaderboardService(
            CourseUserStatsRepository courseUserStatsRepository,
            CourseRepository courseRepository, UserRepository userRepository) {

        this.courseUserStatsRepository = courseUserStatsRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext()
                        .getAuthentication();

        String username = authentication.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }

    public List<CourseUserStats> getCourseStats(Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found")
                );

        List<CourseUserStats> courseStats =
                courseUserStatsRepository.findByCourse(course);

        courseStats.sort(
                (stats1, stats2) -> {

                    int xpComparison = Integer.compare(
                            stats2.getCourseXp(),
                            stats1.getCourseXp()
                    );

                    if (xpComparison != 0) {
                        return xpComparison;
                    }

                    return stats1.getUser()
                            .getUsername()
                            .compareToIgnoreCase(
                                    stats2.getUser().getUsername()
                            );
                }
        );

        return courseStats;
    }

    public List<LeaderboardResponseDTO> getCourseLeaderboard(
            Long courseId) {

        List<CourseUserStats> courseStats =
                getCourseStats(courseId);

        List<LeaderboardResponseDTO> leaderboard =
                new ArrayList<>();

        for (int i = 0; i < courseStats.size(); i++) {

            CourseUserStats stats = courseStats.get(i);

            LeaderboardResponseDTO response =
                    new LeaderboardResponseDTO();

            response.setRank(i + 1);
            response.setUsername(
                    stats.getUser().getUsername()
            );
            response.setXp(
                    stats.getCourseXp()
            );

            leaderboard.add(response);
        }

        return leaderboard;
    }

    public LeaderboardResponseDTO getMyLeaderboardPosition(
            Long courseId) {

        User currentUser = getCurrentUser();

        List<LeaderboardResponseDTO> leaderboard =
                getCourseLeaderboard(courseId);

        for (LeaderboardResponseDTO entry : leaderboard) {

            if (entry.getUsername()
                    .equals(currentUser.getUsername())) {

                return entry;
            }
        }

        return null;
    }

}