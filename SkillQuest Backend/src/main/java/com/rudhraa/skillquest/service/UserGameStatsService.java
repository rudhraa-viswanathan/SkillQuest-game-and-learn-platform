package com.rudhraa.skillquest.service;

import com.rudhraa.skillquest.entity.*;
import com.rudhraa.skillquest.exception.ResourceNotFoundException;
import com.rudhraa.skillquest.repository.UserGameStatsRepository;
import com.rudhraa.skillquest.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.rudhraa.skillquest.dto.UserGameStatsResponseDTO;
import java.time.LocalDateTime;
import com.rudhraa.skillquest.dto.ActivityProgressResponseDTO;
import com.rudhraa.skillquest.dto.ActivityResultDTO;
import com.rudhraa.skillquest.repository.ActivityProgressRepository;
import com.rudhraa.skillquest.repository.ActivityRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserGameStatsService {

    private static final int PASS_SCORE = 60;
    private static final int FULL_REWARD_POINTS = 100;
    private static final int HALF_REWARD_MIN_SCORE = 51;
    private static final int HALF_REWARD_POINTS = 50;
    private static final int ENERGY_PURCHASE_COST = 100;
    private static final int ENERGY_PURCHASE_AMOUNT = 5;

    private final UserGameStatsRepository userGameStatsRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final ActivityProgressRepository activityProgressRepository;
    private final UserProgressService userProgressService;
    private final CourseUserStatsService courseUserStatsService;

    public UserGameStatsService(
            UserGameStatsRepository userGameStatsRepository,
            UserRepository userRepository, ActivityRepository activityRepository, ActivityProgressRepository activityProgressRepository, UserProgressService userProgressService, CourseUserStatsService courseUserStatsService) {

        this.userGameStatsRepository = userGameStatsRepository;
        this.userRepository = userRepository;
        this.activityRepository = activityRepository;
        this.activityProgressRepository = activityProgressRepository;
        this.userProgressService = userProgressService;
        this.courseUserStatsService = courseUserStatsService;
    }

    private int calculateXp(int rewardPoints) {
        return rewardPoints / 10;
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

    private UserGameStats getOrCreateGameStats(User user) {

        return userGameStatsRepository
                .findByUser(user)
                .orElseGet(() -> {

                    UserGameStats gameStats =
                            new UserGameStats();

                    gameStats.setUser(user);
                    gameStats.setPoints(0);
                    gameStats.setXp(0);
                    gameStats.setEnergy(25);
                    gameStats.setEnergyResetAt(
                            LocalDateTime.now().plusHours(24)
                    );

                    return userGameStatsRepository.save(gameStats);
                });
    }

    private UserGameStats resetEnergyIfNeeded(
            UserGameStats gameStats) {

        LocalDateTime now = LocalDateTime.now();

        if (gameStats.getEnergyResetAt() == null) {

            gameStats.setEnergyResetAt(
                    now.plusHours(24)
            );

            return userGameStatsRepository.save(gameStats);
        }

        if (!now.isBefore(gameStats.getEnergyResetAt())) {

            gameStats.setEnergy(25);

            gameStats.setEnergyResetAt(
                    now.plusHours(24)
            );

            return userGameStatsRepository.save(gameStats);
        }

        return gameStats;
    }

    public boolean hasEnergyAvailable() {

        User user = getCurrentUser();

        UserGameStats gameStats =
                getOrCreateGameStats(user);

        gameStats = resetEnergyIfNeeded(gameStats);

        return gameStats.getEnergy() > 0;
    }

    public UserGameStats consumeEnergy() {

        User user = getCurrentUser();

        UserGameStats gameStats =
                getOrCreateGameStats(user);

        gameStats = resetEnergyIfNeeded(gameStats);

        if (gameStats.getEnergy() <= 0) {
            throw new IllegalArgumentException(
                    "Not enough energy to start this activity"
            );
        }

        gameStats.setEnergy(
                gameStats.getEnergy() - 1
        );

        return userGameStatsRepository.save(gameStats);
    }

    private int calculateSuccessfulReward(int scorePercentage) {

        if (scorePercentage >= PASS_SCORE) {
            return FULL_REWARD_POINTS;
        }

        return 0;
    }

    private int calculateFailedReward(int scorePercentage) {

        if (scorePercentage >= HALF_REWARD_MIN_SCORE
                && scorePercentage < PASS_SCORE) {

            return HALF_REWARD_POINTS;
        }

        return 0;
    }

    private UserGameStats applyFailedReward(
            UserGameStats gameStats,
            int scorePercentage) {

        int rewardPoints =
                calculateFailedReward(scorePercentage);

        if (rewardPoints > 0) {

            gameStats.setPoints(
                    gameStats.getPoints() + rewardPoints
            );

            gameStats.setXp(
                    gameStats.getXp() + calculateXp(rewardPoints)
            );
        }

        return userGameStatsRepository.save(gameStats);
    }

    private UserGameStats applySuccessfulReward(
            UserGameStats gameStats,
            int scorePercentage) {

        int rewardPoints =
                calculateSuccessfulReward(scorePercentage);

        if (rewardPoints > 0) {

            gameStats.setPoints(
                    gameStats.getPoints() + rewardPoints
            );

            gameStats.setXp(
                    gameStats.getXp() + calculateXp(rewardPoints)
            );
        }

        return userGameStatsRepository.save(gameStats);
    }

    @Transactional
    public ActivityProgressResponseDTO processActivityResult(
            ActivityResultDTO resultDTO) {

        User user = getCurrentUser();

        Activity activity = activityRepository
                .findById(resultDTO.getActivityId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Activity not found with ID: "
                                        + resultDTO.getActivityId()
                        )
                );

        Course course = activity.getTopic().getCourse();

        UserGameStats gameStats =
                getOrCreateGameStats(user);

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

        int scorePercentage =
                resultDTO.getScorePercentage();

        if (!activityProgress.isRewardGranted()) {

            if (scorePercentage >= PASS_SCORE) {

                int rewardPoints =
                        calculateSuccessfulReward(scorePercentage);

                applySuccessfulReward(
                        gameStats,
                        scorePercentage
                );

                int earnedXp = calculateXp(rewardPoints);

                courseUserStatsService.addCourseXp(
                        user,
                        course,
                        earnedXp
                );

                activityProgress.setRewardGranted(true);

            } else if (scorePercentage >= HALF_REWARD_MIN_SCORE) {

                int rewardPoints =
                        calculateFailedReward(scorePercentage);

                applyFailedReward(
                        gameStats,
                        scorePercentage
                );

                int earnedXp = calculateXp(rewardPoints);

                courseUserStatsService.addCourseXp(
                        user,
                        course,
                        earnedXp
                );

                activityProgress.setRewardGranted(true);
            }
        }

        activityProgressRepository.save(activityProgress);

        if (scorePercentage >= PASS_SCORE
                && !activityProgress.isCompleted()) {

            return userProgressService
                    .completeActivity(activity.getId());
        }

        return new ActivityProgressResponseDTO(
                activity.getId(),
                activity.getTitle(),
                activityProgress.isCompleted(),
                activityProgress.getCompletedAt()
        );
    }

    public UserGameStatsResponseDTO getMyGameStats() {

        User user = getCurrentUser();

        UserGameStats gameStats =
                getOrCreateGameStats(user);

        gameStats = resetEnergyIfNeeded(gameStats);

        return new UserGameStatsResponseDTO(
                gameStats.getPoints(),
                gameStats.getXp(),
                gameStats.getEnergy(),
                gameStats.getEnergyResetAt()
        );
    }

    public UserGameStatsResponseDTO buyEnergy() {

        User user = getCurrentUser();

        UserGameStats gameStats =
                getOrCreateGameStats(user);

        gameStats = resetEnergyIfNeeded(gameStats);

        if (gameStats.getPoints() < ENERGY_PURCHASE_COST) {
            throw new IllegalArgumentException(
                    "Not enough points to buy energy"
            );
        }

        gameStats.setPoints(
                gameStats.getPoints() - ENERGY_PURCHASE_COST
        );

        gameStats.setEnergy(
                gameStats.getEnergy() + ENERGY_PURCHASE_AMOUNT
        );

        gameStats = userGameStatsRepository.save(gameStats);

        return new UserGameStatsResponseDTO(
                gameStats.getPoints(),
                gameStats.getXp(),
                gameStats.getEnergy(),
                gameStats.getEnergyResetAt()
        );
    }
}