package com.rudhraa.skillquest.controller;

import com.rudhraa.skillquest.entity.Topic;
import com.rudhraa.skillquest.service.TopicService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    private final TopicService topicService;

    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    @PostMapping("/course/{courseId}")
    public Topic createTopic(
            @PathVariable Long courseId,
            @RequestBody Topic topic) {

        return topicService.saveTopic(courseId, topic);
    }

    @GetMapping
    public List<Topic> getAllTopics() {
        return topicService.getAllTopics();
    }

    @GetMapping("/{id}")
    public Topic getTopicById(@PathVariable Long id) {
        return topicService.getTopicById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Topic updateTopic(
            @PathVariable Long id,
            @RequestBody Topic topic) {

        return topicService.updateTopic(id, topic);
    }

    @DeleteMapping("/{id}")
    public String deleteTopic(@PathVariable Long id) {

        topicService.deleteTopic(id);

        return "Topic deleted successfully";
    }
}