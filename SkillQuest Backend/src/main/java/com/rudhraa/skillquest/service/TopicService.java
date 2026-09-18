package com.rudhraa.skillquest.service;

import com.rudhraa.skillquest.entity.Topic;
import com.rudhraa.skillquest.repository.TopicRepository;
import org.springframework.stereotype.Service;
import com.rudhraa.skillquest.entity.Course;
import com.rudhraa.skillquest.repository.CourseRepository;
import com.rudhraa.skillquest.dto.TopicRequestDTO;
import com.rudhraa.skillquest.dto.TopicResponseDTO;
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

    public TopicResponseDTO saveTopic(
            Long courseId,
            TopicRequestDTO topicRequestDTO) {

        Course course = courseRepository.findById(courseId).orElse(null);

        if (course == null) {
            return null;
        }

        Topic topic = mapToEntity(topicRequestDTO);
        topic.setCourse(course);

        Topic savedTopic = topicRepository.save(topic);

        return mapToResponseDTO(savedTopic);
    }

    public List<TopicResponseDTO> getAllTopics() {

        return topicRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }
    public Optional<TopicResponseDTO> getTopicById(Long id) {

        return topicRepository.findById(id)
                .map(this::mapToResponseDTO);
    }

    public TopicResponseDTO updateTopic(
            Long id,
            TopicRequestDTO topicRequestDTO) {

        Topic existingTopic = topicRepository.findById(id).orElse(null);

        if (existingTopic == null) {
            return null;
        }

        existingTopic.setName(topicRequestDTO.getName());
        existingTopic.setDescription(topicRequestDTO.getDescription());

        Topic updatedTopic = topicRepository.save(existingTopic);

        return mapToResponseDTO(updatedTopic);
    }

    public void deleteTopic(Long id) {
        topicRepository.deleteById(id);
    }

    private Topic mapToEntity(TopicRequestDTO topicRequestDTO) {

        Topic topic = new Topic();

        topic.setName(topicRequestDTO.getName());
        topic.setDescription(topicRequestDTO.getDescription());

        return topic;
    }

    private TopicResponseDTO mapToResponseDTO(Topic topic) {

        TopicResponseDTO topicResponseDTO = new TopicResponseDTO();

        topicResponseDTO.setId(topic.getId());
        topicResponseDTO.setName(topic.getName());
        topicResponseDTO.setDescription(topic.getDescription());

        if (topic.getCourse() != null) {
            topicResponseDTO.setCourseId(topic.getCourse().getId());
        }

        return topicResponseDTO;
    }
}