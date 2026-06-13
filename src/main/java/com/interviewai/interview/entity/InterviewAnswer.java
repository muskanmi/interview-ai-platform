package com.interviewai.interview.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "interview_answers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long sessionId;

    private Long questionId;

    @Column(columnDefinition = "TEXT")
    private String answer;

    private Integer score;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private LocalDateTime answeredAt;
}