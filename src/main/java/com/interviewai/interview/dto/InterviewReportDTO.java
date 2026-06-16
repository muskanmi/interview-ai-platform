package com.interviewai.interview.dto;

import lombok.Data;

import java.util.List;

@Data
public class InterviewReportDTO {

    private Double averageScore;

    private List<String> strengths;

    private List<String> weaknesses;

    private List<String> recommendations;

    private String overallSummary;

    private String hiringRecommendation;

    private String communicationLevel;

    private String technicalLevel;
}