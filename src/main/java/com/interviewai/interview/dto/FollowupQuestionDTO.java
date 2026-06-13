package com.interviewai.interview.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FollowupQuestionDTO {

    private Long followupId;

    private String question;
}