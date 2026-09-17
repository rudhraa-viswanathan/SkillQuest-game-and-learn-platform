package com.rudhraa.skillquest.service;
import com.rudhraa.skillquest.entity.Topic;
import com.rudhraa.skillquest.repository.TopicRepository;
import com.rudhraa.skillquest.entity.Activity;
import com.rudhraa.skillquest.repository.ActivityRepository;
import org.springframework.stereotype.Service;

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

    public Activity saveActivity(Long topicId, Activity activity) {

        Topic topic = topicRepository.findById(topicId)
                .orElse(null);

        if (topic == null) {
            return null;
        }

        activity.setTopic(topic);

        return activityRepository.save(activity);
    }

    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    public Optional<Activity> getActivityById(Long id) {
        return activityRepository.findById(id);
    }

    public Activity updateActivity(Long id, Activity updatedActivity) {

        Activity existingActivity = activityRepository.findById(id)
                .orElse(null);

        if (existingActivity == null) {
            return null;
        }

        existingActivity.setTitle(updatedActivity.getTitle());
        existingActivity.setDescription(updatedActivity.getDescription());
        existingActivity.setType(updatedActivity.getType());

        return activityRepository.save(existingActivity);
    }

    public void deleteActivity(Long id) {
        activityRepository.deleteById(id);
    }
}