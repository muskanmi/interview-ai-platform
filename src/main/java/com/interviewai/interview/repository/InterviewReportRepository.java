package com.interviewai.interview.repository;

import com.interviewai.interview.entity.InterviewReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InterviewReportRepository
        extends JpaRepository<InterviewReport, Long> {

    Optional<InterviewReport> findBySessionId(
            Long sessionId
    );
}