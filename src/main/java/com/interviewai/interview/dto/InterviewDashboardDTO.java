package com.interviewai.interview.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InterviewDashboardDTO {

    private Integer answeredQuestions;

    private Integer totalQuestions;

    private Double averageScore;

    private Boolean completed;
}