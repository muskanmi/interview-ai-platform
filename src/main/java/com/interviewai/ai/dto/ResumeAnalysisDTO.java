package com.interviewai.ai.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeAnalysisDTO {

    private List<String> strengths;

    private List<String> weaknesses;

    private List<String> missingSkills;

    private List<String> suggestions;
}