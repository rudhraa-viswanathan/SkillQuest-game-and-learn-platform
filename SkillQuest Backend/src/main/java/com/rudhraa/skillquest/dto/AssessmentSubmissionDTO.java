package com.rudhraa.skillquest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AssessmentSubmissionDTO {

    @NotNull(message = "Assessment ID is required")
    private Long assessmentId;

    @NotBlank(message = "Answer is required")
    private String answer;

    public AssessmentSubmissionDTO() {
    }

    public Long getAssessmentId() {
        return assessmentId;
    }

    public void setAssessmentId(Long assessmentId) {
        this.assessmentId = assessmentId;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}