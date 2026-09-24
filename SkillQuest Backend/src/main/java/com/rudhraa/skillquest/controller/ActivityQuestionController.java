package com.rudhraa.skillquest.controller;
import com.rudhraa.skillquest.dto.*;
import com.rudhraa.skillquest.service.ActivityQuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("/api/activity-questions")
public class ActivityQuestionController {

    private final ActivityQuestionService activityQuestionService;

    public ActivityQuestionController(
            ActivityQuestionService activityQuestionService) {

        this.activityQuestionService =
                activityQuestionService;
    }

    @GetMapping("/activity/{activityId}")
    public ResponseEntity<List<ActivityQuestionResponseDTO>>
    getQuestionsByActivity(
            @PathVariable Long activityId) {

        return ResponseEntity.ok(
                activityQuestionService
                        .getQuestionsByActivity(activityId)
        );
    }

    @PostMapping("/activity/{activityId}")
    public ResponseEntity<ActivityQuestionResponseDTO> createQuestion(
            @PathVariable Long activityId,
            @RequestBody ActivityQuestionRequestDTO requestDTO) {

        ActivityQuestionResponseDTO response =
                activityQuestionService.createQuestion(
                        activityId,
                        requestDTO
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{questionId}")
    public ResponseEntity<ActivityQuestionResponseDTO> updateQuestion(
            @PathVariable Long questionId,
            @RequestBody ActivityQuestionRequestDTO requestDTO) {

        ActivityQuestionResponseDTO response =
                activityQuestionService.updateQuestion(
                        questionId,
                        requestDTO
                );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable Long questionId) {

        activityQuestionService.deleteQuestion(questionId);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/validate")
    public ResponseEntity<ActivityAnswerResponseDTO>
    validateAnswer(
            @RequestBody ActivityAnswerRequestDTO requestDTO) {

        return ResponseEntity.ok(
                activityQuestionService
                        .validateAnswer(
                                requestDTO
                        )
        );
    }

    @GetMapping("/public/activity/{activityId}")
    public ResponseEntity<List<ActivityQuestionPublicResponseDTO>>
    getPublicQuestionsByActivity(
            @PathVariable Long activityId) {

        return ResponseEntity.ok(
                activityQuestionService
                        .getPublicQuestionsByActivity(
                                activityId
                        )
        );
    }

}