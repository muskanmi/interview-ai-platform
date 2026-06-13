package com.interviewai.interview.dto;

import lombok.Data;

@Data
public class AnswerEvaluationDTO {

    private Integer score;

    private String feedback;

    private Boolean questionCompleted;

    private Boolean nextQuestionAvailable;

    private Integer currentQuestionIndex;
}
