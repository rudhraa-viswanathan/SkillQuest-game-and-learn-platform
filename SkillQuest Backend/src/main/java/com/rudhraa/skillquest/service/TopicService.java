package com.rudhraa.skillquest.service;

import com.rudhraa.skillquest.entity.Topic;
import com.rudhraa.skillquest.repository.TopicRepository;
import org.springframework.stereotype.Service;
import com.rudhraa.skillquest.entity.Course;
import com.rudhraa.skillquest.repository.CourseRepository;
import java.util.List;
import java.util.Optional;

@Service
public class TopicService {

    private final TopicRepository topicRepository;
    private final CourseRepository courseRepository;

    public TopicService(TopicRepository topicRepository, CourseRepository courseRepository) {
        this.topicRepository = topicRepository;
        this.courseRepository = courseRepository;
    }

    public Topic saveTopic(Long courseId, Topic topic) {

        Course course = courseRepository.findById(courseId)
                .orElse(null);

        if (course == null) {
            return null;
        }

        topic.setCourse(course);

        return topicRepository.save(topic);
    }

    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    public Optional<Topic> getTopicById(Long id) {
        return topicRepository.findById(id);
    }

    public Topic updateTopic(Long id, Topic updatedTopic) {

        Topic existingTopic = topicRepository.findById(id)
                .orElse(null);

        if (existingTopic == null) {
            return null;
        }

        existingTopic.setName(updatedTopic.getName());
        existingTopic.setDescription(updatedTopic.getDescription());

        return topicRepository.save(existingTopic);
    }

    public void deleteTopic(Long id) {
        topicRepository.deleteById(id);
    }
}