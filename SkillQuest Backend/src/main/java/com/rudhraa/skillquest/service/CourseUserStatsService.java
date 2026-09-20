package com.rudhraa.skillquest.service;

import com.rudhraa.skillquest.entity.Course;
import com.rudhraa.skillquest.entity.CourseUserStats;
import com.rudhraa.skillquest.entity.User;
import com.rudhraa.skillquest.repository.CourseUserStatsRepository;
import org.springframework.stereotype.Service;

@Service
public class CourseUserStatsService {

    private final CourseUserStatsRepository courseUserStatsRepository;

    public CourseUserStatsService(
            CourseUserStatsRepository courseUserStatsRepository) {

        this.courseUserStatsRepository = courseUserStatsRepository;
    }

    public CourseUserStats getOrCreateCourseStats(
            User user,
            Course course) {

        return courseUserStatsRepository
                .findByUserAndCourse(user, course)
                .orElseGet(() -> {

                    CourseUserStats courseStats =
                            new CourseUserStats();

                    courseStats.setUser(user);
                    courseStats.setCourse(course);
                    courseStats.setCourseXp(0);

                    return courseUserStatsRepository.save(
                            courseStats
                    );
                });
    }

    public CourseUserStats addCourseXp(
            User user,
            Course course,
            int earnedXp) {

        CourseUserStats courseStats =
                getOrCreateCourseStats(user, course);

        courseStats.setCourseXp(
                courseStats.getCourseXp() + earnedXp
        );

        return courseUserStatsRepository.save(courseStats);
    }
}