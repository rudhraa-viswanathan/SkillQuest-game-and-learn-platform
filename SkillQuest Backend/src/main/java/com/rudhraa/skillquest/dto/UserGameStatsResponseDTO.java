package com.rudhraa.skillquest.dto;

import java.time.LocalDateTime;

public class UserGameStatsResponseDTO {

    private int points;
    private int xp;
    private int energy;
    private LocalDateTime energyResetAt;

    public UserGameStatsResponseDTO() {
    }

    public UserGameStatsResponseDTO(
            int points,
            int xp,
            int energy,
            LocalDateTime energyResetAt) {

        this.points = points;
        this.xp = xp;
        this.energy = energy;
        this.energyResetAt = energyResetAt;
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