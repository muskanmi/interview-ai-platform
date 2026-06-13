package com.interviewai.resume.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String candidateName;

    private Double experience;

    private String email;

    private String phone;

    @Column(columnDefinition = "TEXT")
    private String resumeText;

    private LocalDateTime uploadedAt;

}