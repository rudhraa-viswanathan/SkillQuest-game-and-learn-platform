package com.rudhraa.skillquest.controller;
import jakarta.validation.Valid;
import com.rudhraa.skillquest.entity.Topic;
import com.rudhraa.skillquest.service.TopicService;
import org.springframework.web.bind.annotation.*;
import com.rudhraa.skillquest.dto.TopicRequestDTO;
import com.rudhraa.skillquest.dto.TopicResponseDTO;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    private final TopicService topicService;

    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    @PostMapping("/course/{courseId}")
    public TopicResponseDTO createTopic(
            @PathVariable Long courseId,
            @Valid @RequestBody TopicRequestDTO topicRequestDTO) {

        return topicService.saveTopic(courseId, topicRequestDTO);
    }

    @GetMapping
    public List<TopicResponseDTO> getAllTopics() {
        return topicService.getAllTopics();
    }

    @GetMapping("/{id}")
    public TopicResponseDTO getTopicById(@PathVariable Long id) {
        return topicService.getTopicById(id);
    }

    @PutMapping("/{id}")
    public TopicResponseDTO updateTopic(
            @PathVariable Long id,
           @Valid @RequestBody TopicRequestDTO topicRequestDTO) {

        return topicService.updateTopic(id, topicRequestDTO);
    }

    @DeleteMapping("/{id}")
    public String deleteTopic(@PathVariable Long id) {

        topicService.deleteTopic(id);

        return "Topic deleted successfully";
    }
}