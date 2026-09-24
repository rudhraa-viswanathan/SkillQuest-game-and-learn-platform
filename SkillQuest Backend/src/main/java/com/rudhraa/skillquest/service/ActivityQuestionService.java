package com.rudhraa.skillquest.service;
import com.rudhraa.skillquest.dto.ActivityAnswerRequestDTO;
import com.rudhraa.skillquest.dto.ActivityAnswerResponseDTO;
import com.rudhraa.skillquest.dto.ActivityQuestionResponseDTO;
import com.rudhraa.skillquest.entity.ActivityQuestion;
import com.rudhraa.skillquest.repository.ActivityQuestionRepository;
import org.springframework.stereotype.Service;
import com.rudhraa.skillquest.dto.ActivityQuestionRequestDTO;
import com.rudhraa.skillquest.entity.Activity;
import com.rudhraa.skillquest.repository.ActivityRepository;
import com.rudhraa.skillquest.dto.ActivityQuestionPublicResponseDTO;

import java.util.ArrayList;
import java.util.Collections;
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

    public List<ActivityQuestionPublicResponseDTO>
    getPublicQuestionsByActivity(Long activityId) {

        List<ActivityQuestion> questions =
                activityQuestionRepository
                        .findByActivityIdOrderByOrderIndexAsc(activityId);

        if (questions.isEmpty()) {
            return List.of();
        }

        boolean isMatching =
                questions.get(0).getActivity() != null &&
                        questions.get(0).getActivity().getType() != null &&
                        questions.get(0).getActivity().getType().name()
                                .equals("MATCHING");

        String matchingAnswerData = null;

        if (isMatching) {

            List<String> leftItems = new ArrayList<>();
            List<String> rightItems = new ArrayList<>();

            for (ActivityQuestion question : questions) {

                if (question.getQuestion() != null) {
                    leftItems.add(
                            question.getQuestion().trim()
                    );
                }

                if (question.getCorrectAnswer() != null) {
                    rightItems.add(
                            question.getCorrectAnswer().trim()
                    );
                }
            }

            Collections.shuffle(rightItems);

            matchingAnswerData =
                    String.join("|", leftItems)
                            + "###"
                            + String.join("|", rightItems);
        }

        final String publicMatchingData =
                matchingAnswerData;

        return questions
                .stream()
                .map(question ->
                        new ActivityQuestionPublicResponseDTO(
                                question.getId(),
                                question.getQuestion(),
                                question.getOptions(),
                                question.getCodeSnippet(),
                                question.getOrderIndex(),
                                isMatching
                                        ? publicMatchingData
                                        : buildPublicAnswerData(question)
                        )
                )
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

    public ActivityAnswerResponseDTO validateAnswer(
            ActivityAnswerRequestDTO requestDTO) {

        ActivityQuestion question =
                activityQuestionRepository
                        .findById(requestDTO.getQuestionId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Activity question not found"
                                )
                        );

        String submittedAnswer =
                requestDTO.getAnswer() == null
                        ? ""
                        : requestDTO.getAnswer();

        String storedAnswer =
                question.getCorrectAnswer();

        boolean correct = false;

        if (
                storedAnswer != null &&
                        question.getActivity() != null &&
                        question.getActivity().getType() != null
        ) {

            switch (question.getActivity().getType()) {

                // =========================================
                // QUIZ
                // =========================================

                case QUIZ:

                    correct =
                            normalizeTextAnswer(submittedAnswer)
                                    .equals(
                                            normalizeTextAnswer(storedAnswer)
                                    );

                    break;


                // =========================================
                // FILL IN THE BLANK
                // =========================================

                case FILL_IN_THE_BLANK:

                    correct =
                            normalizeTextAnswer(submittedAnswer)
                                    .equals(
                                            normalizeTextAnswer(storedAnswer)
                                    );

                    break;


                // =========================================
                // TRUE / FALSE
                // =========================================

                case TRUE_FALSE:

                    correct =
                            normalizeTextAnswer(submittedAnswer)
                                    .equals(
                                            normalizeTextAnswer(storedAnswer)
                                    );

                    break;


                // =========================================
                // CODE OUTPUT
                // =========================================

                case CODE_OUTPUT:

                    correct =
                            normalizeAnswer(submittedAnswer)
                                    .equals(
                                            normalizeAnswer(storedAnswer)
                                    );

                    break;


                // =========================================
                // DEBUGGING
                // =========================================

                case DEBUGGING:

                    correct =
                            normalizeTextAnswer(submittedAnswer)
                                    .equals(
                                            normalizeTextAnswer(storedAnswer)
                                    );

                    break;


                // =========================================
                // MATCHING
                // =========================================

                case MATCHING:

                    String expectedPair =
                            question.getQuestion()
                                    + "="
                                    + storedAnswer;

                    correct =
                            normalizeAnswer(submittedAnswer)
                                    .equals(
                                            normalizeAnswer(expectedPair)
                                    );

                    break;


                // =========================================
                // CODE ORDERING
                // =========================================

                case CODE_ORDERING:

                    correct =
                            normalizeCodeAnswer(submittedAnswer)
                                    .equals(
                                            normalizeCodeAnswer(storedAnswer)
                                    );

                    break;


                // =========================================
                // CODE CHALLENGE
                // =========================================

                case CODE_CHALLENGE:

                    String[] acceptedAnswers =
                            storedAnswer.split("\\|");

                    for (String acceptedAnswer : acceptedAnswers) {

                        if (
                                normalizeCodeAnswer(submittedAnswer)
                                        .equals(
                                                normalizeCodeAnswer(
                                                        acceptedAnswer
                                                )
                                        )
                        ) {

                            correct = true;
                            break;
                        }
                    }

                    break;
            }
        }

        return new ActivityAnswerResponseDTO(
                correct,
                correct
                        ? question.getExplanation()
                        : null
        );
    }


    private boolean validateMatchingAnswer(
            String storedAnswer,
            String submittedAnswer) {

        String normalizedSubmitted =
                normalizeAnswer(
                        submittedAnswer
                );


        String[] storedPairs =
                storedAnswer.split("\\|");


        for (String pair : storedPairs) {

            if (
                    normalizeAnswer(pair)
                            .equals(
                                    normalizedSubmitted
                            )
            ) {
                return true;
            }
        }


        return false;
    }


    private String normalizeTextAnswer(
            String answer) {

        if (answer == null) {
            return "";
        }

        return answer
                .trim()
                .replaceAll("\\s+", " ")
                .toLowerCase();
    }


    private String normalizeCodeAnswer(
            String answer) {

        if (answer == null) {
            return "";
        }

        return answer
                .trim()
                .replaceAll("\\s+", " ");
    }


    private String normalizeAnswer(
            String answer) {

        if (answer == null) {
            return "";
        }

        return answer
                .trim()
                .replaceAll("\\s+", " ");
    }

    private String buildPublicAnswerData(
            ActivityQuestion question) {

        return null;
    }

}