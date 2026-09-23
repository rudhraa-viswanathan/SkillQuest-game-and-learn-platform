package com.rudhraa.skillquest.service;

import com.rudhraa.skillquest.dto.ActivityRequestDTO;
import com.rudhraa.skillquest.dto.ActivityResponseDTO;
import com.rudhraa.skillquest.entity.Activity;
import com.rudhraa.skillquest.entity.Topic;
import com.rudhraa.skillquest.exception.ResourceNotFoundException;
import com.rudhraa.skillquest.repository.ActivityRepository;
import com.rudhraa.skillquest.repository.TopicRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final TopicRepository topicRepository;

    public ActivityService(
            ActivityRepository activityRepository,
            TopicRepository topicRepository) {

        this.activityRepository = activityRepository;
        this.topicRepository = topicRepository;
    }

    // =====================================================
    // CREATE ACTIVITY
    // =====================================================

    public ActivityResponseDTO saveActivity(
            Long topicId,
            ActivityRequestDTO activityRequestDTO) {

        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Topic not found with id: " + topicId
                        )
                );

        Activity activity =
                mapToEntity(activityRequestDTO);

        activity.setTopic(topic);

        Activity savedActivity =
                activityRepository.save(activity);

        return mapToResponseDTO(savedActivity);
    }


    // =====================================================
    // GET ALL ACTIVITIES
    // =====================================================

    public List<ActivityResponseDTO> getAllActivities() {

        return activityRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // =====================================================
    // GET ACTIVITY BY ID
    // =====================================================

    public ActivityResponseDTO getActivityById(Long id) {

        Activity activity =
                activityRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Activity not found with id: " + id
                                )
                        );

        return mapToResponseDTO(activity);
    }


    // =====================================================
    // GET ACTIVITIES BY TOPIC
    // =====================================================

    public List<ActivityResponseDTO> getActivitiesByTopic(
            Long topicId) {

        if (!topicRepository.existsById(topicId)) {
            throw new ResourceNotFoundException(
                    "Topic not found with id: " + topicId
            );
        }

        return activityRepository
                .findByTopicIdOrderByOrderIndexAsc(topicId)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // =====================================================
    // UPDATE ACTIVITY
    // =====================================================

    public ActivityResponseDTO updateActivity(
            Long id,
            ActivityRequestDTO activityRequestDTO) {

        Activity existingActivity =
                activityRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Activity not found with id: " + id
                                )
                        );

        updateEntity(
                existingActivity,
                activityRequestDTO
        );

        Activity updatedActivity =
                activityRepository.save(existingActivity);

        return mapToResponseDTO(updatedActivity);
    }


    // =====================================================
    // DELETE ACTIVITY
    // =====================================================

    public void deleteActivity(Long id) {

        Activity activity =
                activityRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Activity not found with id: " + id
                                )
                        );

        activityRepository.delete(activity);
    }


    // =====================================================
    // REQUEST DTO -> ENTITY
    // =====================================================

    private Activity mapToEntity(
            ActivityRequestDTO dto) {

        Activity activity = new Activity();

        updateEntity(activity, dto);

        return activity;
    }


    // =====================================================
    // UPDATE ENTITY FIELDS
    // =====================================================

    private void updateEntity(
            Activity activity,
            ActivityRequestDTO dto) {

        activity.setTitle(dto.getTitle());
        activity.setDescription(dto.getDescription());
        activity.setType(dto.getType());

        activity.setQuestion(dto.getQuestion());
        activity.setOptions(dto.getOptions());
        activity.setCorrectAnswer(dto.getCorrectAnswer());
        activity.setCodeSnippet(dto.getCodeSnippet());
        activity.setExplanation(dto.getExplanation());

        activity.setOrderIndex(dto.getOrderIndex());
    }


    // =====================================================
    // ENTITY -> RESPONSE DTO
    // =====================================================

    private ActivityResponseDTO mapToResponseDTO(
            Activity activity) {

        ActivityResponseDTO dto =
                new ActivityResponseDTO();

        dto.setId(activity.getId());

        dto.setTitle(
                activity.getTitle()
        );

        dto.setDescription(
                activity.getDescription()
        );

        dto.setType(
                activity.getType()
        );

        dto.setQuestion(
                activity.getQuestion()
        );

        dto.setOptions(
                activity.getOptions()
        );

        dto.setCorrectAnswer(
                activity.getCorrectAnswer()
        );

        dto.setCodeSnippet(
                activity.getCodeSnippet()
        );

        dto.setExplanation(
                activity.getExplanation()
        );

        dto.setOrderIndex(
                activity.getOrderIndex()
        );

        if (activity.getTopic() != null) {

            dto.setTopicId(
                    activity.getTopic().getId()
            );
        }

        return dto;
    }
}