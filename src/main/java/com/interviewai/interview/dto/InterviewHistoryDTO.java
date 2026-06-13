package com.interviewai.interview.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InterviewHistoryDTO {

    private String question;

    private String answer;

    private Integer score;

    private String feedback;
}