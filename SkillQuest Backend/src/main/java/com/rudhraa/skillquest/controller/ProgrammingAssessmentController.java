package com.rudhraa.skillquest.controller;

import com.rudhraa.skillquest.dto.ProgrammingAssessmentResponseDTO;
import com.rudhraa.skillquest.service.ProgrammingAssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.rudhraa.skillquest.dto.AssessmentSubmissionDTO;
import com.rudhraa.skillquest.dto.AssessmentAttemptResponseDTO;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/assessments")
public class ProgrammingAssessmentController {

    private final ProgrammingAssessmentService programmingAssessmentService;

    public ProgrammingAssessmentController(
            ProgrammingAssessmentService programmingAssessmentService) {

        this.programmingAssessmentService =
                programmingAssessmentService;
    }

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<ProgrammingAssessmentResponseDTO>
    getAssessmentByCourse(@PathVariable Long courseId) {

        ProgrammingAssessmentResponseDTO response =
                programmingAssessmentService
                        .getAssessmentByCourse(courseId);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/submit")
    public ResponseEntity<AssessmentAttemptResponseDTO> submitAssessment(
            @Valid @RequestBody AssessmentSubmissionDTO submissionDTO) {

        AssessmentAttemptResponseDTO response =
                programmingAssessmentService
                        .submitAssessment(submissionDTO);

        return ResponseEntity.ok(response);
    }
}