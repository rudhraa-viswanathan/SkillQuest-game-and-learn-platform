package com.rudhraa.skillquest.repository;

import com.rudhraa.skillquest.entity.User;
import com.rudhraa.skillquest.entity.UserGameStats;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserGameStatsRepository
        extends JpaRepository<UserGameStats, Long> {

    Optional<UserGameStats> findByUser(User user);
}