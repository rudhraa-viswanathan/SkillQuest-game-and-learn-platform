package com.rudhraa.skillquest.dto;

public class ActivityQuestionPublicResponseDTO {

    private Long id;
    private String question;
    private String options;
    private String codeSnippet;
    private Integer orderIndex;
    private String answerData;



    public ActivityQuestionPublicResponseDTO(
            Long id,
            String question,
            String options,
            String codeSnippet,
            Integer orderIndex,
            String answerData) {

        this.id = id;
        this.question = question;
        this.options = options;
        this.codeSnippet = codeSnippet;
        this.orderIndex = orderIndex;
        this.answerData = answerData;
    }


    public Long getId() {
        return id;
    }

    public String getQuestion() {
        return question;
    }

    public String getOptions() {
        return options;
    }

    public String getCodeSnippet() {
        return codeSnippet;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public String getAnswerData() {
        return answerData;
    }

}