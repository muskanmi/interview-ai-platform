package com.interviewai.interview.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "interview_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long sessionId;

    private Double averageScore;

    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(columnDefinition = "TEXT")
    private String weaknesses;

    @Column(columnDefinition = "TEXT")
    private String recommendations;

    @Column(columnDefinition = "TEXT")
    private String overallSummary;

    @Column(columnDefinition = "TEXT")
    private String hiringRecommendation;

    private String communicationLevel;

    private String technicalLevel;
}