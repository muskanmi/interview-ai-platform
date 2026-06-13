package com.interviewai.interview.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "interview_followups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewFollowup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long sessionId;

    private Long questionId;

    @Column(columnDefinition = "TEXT")
    private String followupQuestion;

    @Column(columnDefinition = "TEXT")
    private String followupAnswer;

    private Integer score;

    @Column(columnDefinition = "TEXT")
    private String feedback;
}