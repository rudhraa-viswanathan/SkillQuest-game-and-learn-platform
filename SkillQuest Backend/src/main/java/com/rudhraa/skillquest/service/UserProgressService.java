package com.rudhraa.skillquest.service;
import com.rudhraa.skillquest.entity.Topic;
import com.rudhraa.skillquest.repository.TopicRepository;
import com.rudhraa.skillquest.repository.ActivityProgressRepository;
import com.rudhraa.skillquest.repository.ActivityRepository;
import com.rudhraa.skillquest.repository.CourseRepository;
import com.rudhraa.skillquest.repository.UserProgressRepository;
import com.rudhraa.skillquest.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.rudhraa.skillquest.entity.Course;
import com.rudhraa.skillquest.entity.UserProgress;
import com.rudhraa.skillquest.entity.User;
import com.rudhraa.skillquest.exception.ResourceNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.rudhraa.skillquest.dto.ActivityProgressResponseDTO;
import com.rudhraa.skillquest.entity.Activity;
import com.rudhraa.skillquest.entity.ActivityProgress;
import java.time.LocalDateTime;
import java.util.List;
import com.rudhraa.skillquest.dto.UserProgressResponseDTO;
import com.rudhraa.skillquest.dto.TopicProgressResponseDTO;

@Service
public class UserProgressService {

    private final UserProgressRepository userProgressRepository;
    private final ActivityProgressRepository activityProgressRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ActivityRepository activityRepository;
    private final TopicRepository topicRepository;
    private final BadgeService badgeService;

    public UserProgressService(
            UserProgressRepository userProgressRepository,
            ActivityProgressRepository activityProgressRepository,
            UserRepository userRepository,
            CourseRepository courseRepository,
            ActivityRepository activityRepository, TopicRepository topicRepository, BadgeService badgeService) {

        this.userProgressRepository = userProgressRepository;
        this.activityProgressRepository = activityProgressRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.activityRepository = activityRepository;
        this.topicRepository = topicRepository;
        this.badgeService = badgeService;
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String username = authentication.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with username: " + username
                        )
                );
    }


    private UserProgress updateCourseProgress(
            User user,
            Course course) {

        UserProgress userProgress =
                getOrCreateUserProgress(user, course);

        long completedActivities =
                activityProgressRepository
                        .countByUserAndCompletedTrueAndActivity_Topic_Course(
                                user,
                                course
                        );

        long totalActivities =
                activityRepository.countByTopic_Course(course);

        double progressPercentage = 0.0;

        if (totalActivities > 0) {
            progressPercentage =
                    ((double) completedActivities / totalActivities) * 100;
        }

        userProgress.setCompletedActivities(
                (int) completedActivities
        );

        userProgress.setTotalActivities(
                (int) totalActivities
        );

        userProgress.setProgressPercentage(
                progressPercentage
        );

        UserProgress savedProgress =
                userProgressRepository.save(userProgress);

        badgeService.checkAndAwardMilestones(
                user,
                course,
                savedProgress.getProgressPercentage()
        );

        return savedProgress;
    }

    public UserProgressResponseDTO getCourseProgress(Long courseId) {

        User user = getCurrentUser();

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Course not found with id: " + courseId
                        )
                );

        UserProgress userProgress =
                updateCourseProgress(user, course);

        return new UserProgressResponseDTO(
                course.getId(),
                course.getName(),
                userProgress.getCompletedActivities(),
                userProgress.getTotalActivities(),
                userProgress.getProgressPercentage()
        );
    }

    public List<TopicProgressResponseDTO> getTopicProgress(
            Long courseId) {

        User user = getCurrentUser();

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Course not found with id: " + courseId
                        )
                );

        List<Topic> topics =
                topicRepository
                        .findByCourseOrderByOrderIndexAsc(course);

        return topics.stream()
                .map(topic -> {

                    long totalActivities =
                            activityRepository.countByTopic(topic);

                    long completedActivities =
                            activityProgressRepository
                                    .countByUserAndCompletedTrueAndActivity_Topic(
                                            user,
                                            topic
                                    );

                    boolean completed =
                            isTopicCompleted(user, topic);

                    boolean unlocked =
                            isTopicUnlocked(user, topic);

                    return new TopicProgressResponseDTO(
                            topic.getId(),
                            topic.getName(),
                            topic.getOrderIndex(),
                            completedActivities,
                            totalActivities,
                            completed,
                            unlocked
                    );
                })
                .toList();
    }

    private boolean isTopicCompleted(
            User user,
            Topic topic) {

        long totalActivities =
                activityRepository.countByTopic(topic);

        long completedActivities =
                activityProgressRepository
                        .countByUserAndCompletedTrueAndActivity_Topic(
                                user,
                                topic
                        );

        return totalActivities > 0
                && completedActivities == totalActivities;
    }

    private boolean isTopicUnlocked(
            User user,
            Topic topic) {

        List<Topic> topics =
                topicRepository
                        .findByCourseOrderByOrderIndexAsc(
                                topic.getCourse()
                        );

        int currentTopicPosition =
                topics.indexOf(topic);

        if (currentTopicPosition == 0) {
            return true;
        }

        if (currentTopicPosition < 0) {
            return false;
        }

        Topic previousTopic =
                topics.get(currentTopicPosition - 1);

        return isTopicCompleted(
                user,
                previousTopic
        );
    }

    private UserProgress getOrCreateUserProgress(
            User user,
            Course course) {

        return userProgressRepository
                .findByUserAndCourse(user, course)
                .orElseGet(() -> {

                    UserProgress userProgress = new UserProgress();

                    userProgress.setUser(user);
                    userProgress.setCourse(course);
                    userProgress.setCompletedActivities(0);
                    userProgress.setTotalActivities(0);
                    userProgress.setProgressPercentage(0.0);

                    return userProgressRepository.save(userProgress);
                });
    }

    public ActivityProgressResponseDTO completeActivity(Long activityId) {

        User user = getCurrentUser();

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Activity not found with id: " + activityId
                        )
                );

        Course course = activity.getTopic().getCourse();

        getOrCreateUserProgress(user, course);

        if (!isTopicUnlocked(user, activity.getTopic())) {
            throw new IllegalArgumentException(
                    "This topic is locked. Complete the previous topic first."
            );
        }

        boolean alreadyCompleted =
                activityProgressRepository
                        .existsByUserAndActivityAndCompletedTrue(
                                user,
                                activity
                        );

        if (alreadyCompleted) {
            throw new IllegalArgumentException(
                    "Activity has already been completed"
            );
        }

        ActivityProgress activityProgress =
                activityProgressRepository
                        .findByUserAndActivity(user, activity)
                        .orElseGet(() -> {

                            ActivityProgress newProgress =
                                    new ActivityProgress();

                            newProgress.setUser(user);
                            newProgress.setActivity(activity);

                            return newProgress;
                        });

        activityProgress.setCompleted(true);
        activityProgress.setCompletedAt(LocalDateTime.now());

        ActivityProgress savedProgress =
                activityProgressRepository.save(activityProgress);

        updateCourseProgress(user, course);

        return new ActivityProgressResponseDTO(
                activity.getId(),
                activity.getTitle(),
                savedProgress.isCompleted(),
                savedProgress.getCompletedAt()
        );
    }
}
