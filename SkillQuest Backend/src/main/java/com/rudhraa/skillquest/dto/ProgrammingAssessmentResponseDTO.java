package com.rudhraa.skillquest.dto;

public class ProgrammingAssessmentResponseDTO {

    private Long assessmentId;
    private Long courseId;
    private String title;
    private String problemDescription;
    private boolean passed;

    public ProgrammingAssessmentResponseDTO() {
    }

    public ProgrammingAssessmentResponseDTO(
            Long assessmentId,
            Long courseId,
            String title,
            String problemDescription,
            boolean passed) {

        this.assessmentId = assessmentId;
        this.courseId = courseId;
        this.title = title;
        this.problemDescription = problemDescription;
        this.passed = passed;
    }

    public Long getAssessmentId() {
        return assessmentId;
    }

    public void setAssessmentId(Long assessmentId) {
        this.assessmentId = assessmentId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getProblemDescription() {
        return problemDescription;
    }

    public void setProblemDescription(String problemDescription) {
        this.problemDescription = problemDescription;
    }

    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }
}