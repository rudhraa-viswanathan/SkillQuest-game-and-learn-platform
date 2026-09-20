package com.rudhraa.skillquest.dto;

public class LeaderboardResponseDTO {

    private int rank;
    private String username;
    private int xp;

    public LeaderboardResponseDTO() {
    }

    public LeaderboardResponseDTO(
            int rank,
            String username,
            int xp) {

        this.rank = rank;
        this.username = username;
        this.xp = xp;
    }

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getXp() {
        return xp;
    }

    public void setXp(int xp) {
        this.xp = xp;
    }
}