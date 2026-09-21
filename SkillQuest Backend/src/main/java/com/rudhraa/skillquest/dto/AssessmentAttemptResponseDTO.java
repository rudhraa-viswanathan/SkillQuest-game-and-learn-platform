package com.rudhraa.skillquest.dto;

import java.time.LocalDateTime;

public class AssessmentAttemptResponseDTO {

    private Long attemptId;
    private int scorePercentage;
    private boolean passed;
    private LocalDateTime attemptedAt;

    public AssessmentAttemptResponseDTO() {
    }

    public AssessmentAttemptResponseDTO(
            Long attemptId,
            int scorePercentage,
            boolean passed,
            LocalDateTime attemptedAt) {

        this.attemptId = attemptId;
        this.scorePercentage = scorePercentage;
        this.passed = passed;
        this.attemptedAt = attemptedAt;
    }

    public Long getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(Long attemptId) {
        this.attemptId = attemptId;
    }

    public int getScorePercentage() {
        return scorePercentage;
    }

    public void setScorePercentage(int scorePercentage) {
        this.scorePercentage = scorePercentage;
    }

    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }

    public LocalDateTime getAttemptedAt() {
        return attemptedAt;
    }

    public void setAttemptedAt(LocalDateTime attemptedAt) {
        this.attemptedAt = attemptedAt;
    }
}