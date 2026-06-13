package com.interviewai.interview.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InterviewCompleteResponseDTO {

    private Long sessionId;

    private Boolean completed;

    private String message;
}