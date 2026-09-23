package com.rudhraa.skillquest.service;
import com.rudhraa.skillquest.exception.ResourceNotFoundException;
import com.rudhraa.skillquest.entity.Course;
import com.rudhraa.skillquest.repository.CourseRepository;
import org.springframework.stereotype.Service;
import com.rudhraa.skillquest.dto.CourseRequestDTO;
import com.rudhraa.skillquest.dto.CourseResponseDTO;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public CourseResponseDTO saveCourse(CourseRequestDTO courseRequestDTO) {

        Course course = mapToEntity(courseRequestDTO);

        Course savedCourse = courseRepository.save(course);

        return mapToResponseDTO(savedCourse);
    }
    public List<CourseResponseDTO> getAllCourses() {

        return courseRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }
    public CourseResponseDTO getCourseById(Long id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Course not found with id: " + id
                        )
                );

        return mapToResponseDTO(course);
    }
    public CourseResponseDTO updateCourse(
            Long id,
            CourseRequestDTO courseRequestDTO) {

        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Course not found with id: " + id
                        )
                );

        existingCourse.setName(courseRequestDTO.getName());
        existingCourse.setDescription(courseRequestDTO.getDescription());

        Course updatedCourse = courseRepository.save(existingCourse);

        return mapToResponseDTO(updatedCourse);
    }

    public void deleteCourse(Long id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Course not found with id: " + id
                        )
                );

        courseRepository.delete(course);
    }

    private Course mapToEntity(CourseRequestDTO courseRequestDTO) {

        Course course = new Course();

        course.setName(courseRequestDTO.getName());
        course.setDescription(courseRequestDTO.getDescription());

        return course;
    }

    private CourseResponseDTO mapToResponseDTO(Course course) {

        CourseResponseDTO courseResponseDTO = new CourseResponseDTO();

        courseResponseDTO.setId(course.getId());
        courseResponseDTO.setName(course.getName());
        courseResponseDTO.setDescription(course.getDescription());

        return courseResponseDTO;
    }

}