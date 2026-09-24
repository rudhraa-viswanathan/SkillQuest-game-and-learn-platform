package com.rudhraa.skillquest.dto;

public class ActivityAnswerResponseDTO {

    private boolean correct;
    private String explanation;


    public ActivityAnswerResponseDTO(
            boolean correct,
            String explanation) {

        this.correct = correct;
        this.explanation = explanation;
    }


    public boolean isCorrect() {
        return correct;
    }

    public String getExplanation() {
        return explanation;
    }
}