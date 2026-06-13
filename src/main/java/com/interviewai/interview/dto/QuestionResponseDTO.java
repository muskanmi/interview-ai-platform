package com.interviewai.interview.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuestionResponseDTO {

    private Integer questionNumber;

    private String question;
}
