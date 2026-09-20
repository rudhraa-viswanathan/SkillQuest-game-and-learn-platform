package com.rudhraa.skillquest.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "user_game_stats")
public class UserGameStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private int points = 0;

    @Column(nullable = false)
    private int xp = 0;

    @Column(nullable = false)
    private int energy = 25;

    @Column(nullable = false)
    private LocalDateTime energyResetAt;

    public UserGameStats() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public int getXp() {
        return xp;
    }

    public void setXp(int xp) {
        this.xp = xp;
    }

    public int getEnergy() {
        return energy;
    }

    public void setEnergy(int energy) {
        this.energy = energy;
    }

    public LocalDateTime getEnergyResetAt() {
        return energyResetAt;
    }

    public void setEnergyResetAt(LocalDateTime energyResetAt) {
        this.energyResetAt = energyResetAt;
    }
}