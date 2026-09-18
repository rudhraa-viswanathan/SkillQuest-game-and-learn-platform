package com.rudhraa.skillquest.service;
import com.rudhraa.skillquest.entity.Topic;
import com.rudhraa.skillquest.repository.TopicRepository;
import com.rudhraa.skillquest.entity.Activity;
import com.rudhraa.skillquest.repository.ActivityRepository;
import org.springframework.stereotype.Service;
import com.rudhraa.skillquest.dto.ActivityRequestDTO;
import com.rudhraa.skillquest.dto.ActivityResponseDTO;

import java.util.List;
import java.util.Optional;

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

    public ActivityResponseDTO saveActivity(
            Long topicId,
            ActivityRequestDTO activityRequestDTO) {

        Topic topic = topicRepository.findById(topicId).orElse(null);

        if (topic == null) {
            return null;
        }

        Activity activity = mapToEntity(activityRequestDTO);
        activity.setTopic(topic);

        Activity savedActivity = activityRepository.save(activity);

        return mapToResponseDTO(savedActivity);
    }

    public List<ActivityResponseDTO> getAllActivities() {

        return activityRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public Optional<ActivityResponseDTO> getActivityById(Long id) {

        return activityRepository.findById(id)
                .map(this::mapToResponseDTO);
    }

    public ActivityResponseDTO updateActivity(
            Long id,
            ActivityRequestDTO activityRequestDTO) {

        Activity existingActivity =
                activityRepository.findById(id).orElse(null);

        if (existingActivity == null) {
            return null;
        }

        existingActivity.setTitle(activityRequestDTO.getTitle());
        existingActivity.setDescription(activityRequestDTO.getDescription());
        existingActivity.setType(activityRequestDTO.getType());

        Activity updatedActivity =
                activityRepository.save(existingActivity);

        return mapToResponseDTO(updatedActivity);
    }

    public void deleteActivity(Long id) {
        activityRepository.deleteById(id);
    }

    private Activity mapToEntity(ActivityRequestDTO activityRequestDTO) {

        Activity activity = new Activity();

        activity.setTitle(activityRequestDTO.getTitle());
        activity.setDescription(activityRequestDTO.getDescription());
        activity.setType(activityRequestDTO.getType());

        return activity;
    }

    private ActivityResponseDTO mapToResponseDTO(Activity activity) {

        ActivityResponseDTO activityResponseDTO =
                new ActivityResponseDTO();

        activityResponseDTO.setId(activity.getId());
        activityResponseDTO.setTitle(activity.getTitle());
        activityResponseDTO.setDescription(activity.getDescription());
        activityResponseDTO.setType(activity.getType());

        if (activity.getTopic() != null) {
            activityResponseDTO.setTopicId(activity.getTopic().getId());
        }

        return activityResponseDTO;
    }

}