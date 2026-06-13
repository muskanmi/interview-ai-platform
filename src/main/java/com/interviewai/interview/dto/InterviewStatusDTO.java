package com.interviewai.interview.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InterviewStatusDTO {

    private Long sessionId;

    private Integer currentQuestion;

    private Integer totalQuestions;

    private Integer progress;

    private Boolean completed;
}