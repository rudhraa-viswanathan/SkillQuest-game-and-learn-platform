package com.rudhraa.skillquest.service;

import com.rudhraa.skillquest.dto.ActivityQuestionResponseDTO;
import com.rudhraa.skillquest.entity.ActivityQuestion;
import com.rudhraa.skillquest.repository.ActivityQuestionRepository;
import org.springframework.stereotype.Service;
import com.rudhraa.skillquest.dto.ActivityQuestionRequestDTO;
import com.rudhraa.skillquest.entity.Activity;
import com.rudhraa.skillquest.repository.ActivityRepository;

import java.util.List;

@Service
public class ActivityQuestionService {

    private final ActivityQuestionRepository activityQuestionRepository;
    private final ActivityRepository activityRepository;

    public ActivityQuestionService(
            ActivityQuestionRepository activityQuestionRepository,
            ActivityRepository activityRepository) {

        this.activityQuestionRepository = activityQuestionRepository;
        this.activityRepository = activityRepository;
    }

    public List<ActivityQuestionResponseDTO>
    getQuestionsByActivity(Long activityId) {

        return activityQuestionRepository
                .findByActivityIdOrderByOrderIndexAsc(activityId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ActivityQuestionResponseDTO mapToResponse(
            ActivityQuestion activityQuestion) {

        ActivityQuestionResponseDTO response =
                new ActivityQuestionResponseDTO();

        response.setId(activityQuestion.getId());
        response.setQuestion(activityQuestion.getQuestion());
        response.setOptions(activityQuestion.getOptions());
        response.setCorrectAnswer(
                activityQuestion.getCorrectAnswer()
        );
        response.setCodeSnippet(
                activityQuestion.getCodeSnippet()
        );
        response.setExplanation(
                activityQuestion.getExplanation()
        );
        response.setOrderIndex(
                activityQuestion.getOrderIndex()
        );

        return response;
    }

    public ActivityQuestionResponseDTO createQuestion(
            Long activityId,
            ActivityQuestionRequestDTO requestDTO) {

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() ->
                        new RuntimeException("Activity not found"));

        ActivityQuestion question = new ActivityQuestion();

        question.setQuestion(requestDTO.getQuestion());
        question.setOptions(requestDTO.getOptions());
        question.setCorrectAnswer(requestDTO.getCorrectAnswer());
        question.setCodeSnippet(requestDTO.getCodeSnippet());
        question.setExplanation(requestDTO.getExplanation());
        question.setOrderIndex(requestDTO.getOrderIndex());
        question.setActivity(activity);

        ActivityQuestion savedQuestion =
                activityQuestionRepository.save(question);

        return mapToResponse(savedQuestion);
    }

    public ActivityQuestionResponseDTO updateQuestion(
            Long questionId,
            ActivityQuestionRequestDTO requestDTO) {

        ActivityQuestion question =
                activityQuestionRepository.findById(questionId)
                        .orElseThrow(() ->
                                new RuntimeException("Activity question not found"));

        question.setQuestion(requestDTO.getQuestion());
        question.setOptions(requestDTO.getOptions());
        question.setCorrectAnswer(requestDTO.getCorrectAnswer());
        question.setCodeSnippet(requestDTO.getCodeSnippet());
        question.setExplanation(requestDTO.getExplanation());
        question.setOrderIndex(requestDTO.getOrderIndex());

        ActivityQuestion updatedQuestion =
                activityQuestionRepository.save(question);

        return mapToResponse(updatedQuestion);
    }

    public void deleteQuestion(Long questionId) {

        ActivityQuestion question =
                activityQuestionRepository.findById(questionId)
                        .orElseThrow(() ->
                                new RuntimeException("Activity question not found"));

        activityQuestionRepository.delete(question);
    }

}