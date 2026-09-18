package com.rudhraa.skillquest.controller;

import com.rudhraa.skillquest.entity.Course;
import com.rudhraa.skillquest.service.CourseService;
import org.springframework.web.bind.annotation.*;
import com.rudhraa.skillquest.dto.CourseRequestDTO;
import com.rudhraa.skillquest.dto.CourseResponseDTO;
import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    public CourseResponseDTO createCourse(
            @Valid @RequestBody CourseRequestDTO courseRequestDTO) {

        return courseService.saveCourse(courseRequestDTO);
    }

    @GetMapping
    public List<CourseResponseDTO> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public CourseResponseDTO getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    @PutMapping("/{id}")
    public CourseResponseDTO updateCourse(
            @PathVariable Long id,
           @Valid @RequestBody CourseRequestDTO courseRequestDTO) {

        return courseService.updateCourse(id, courseRequestDTO);
    }

    @DeleteMapping("/{id}")
    public String deleteCourse(@PathVariable Long id) {

        courseService.deleteCourse(id);

        return "Course deleted successfully";
    }
}