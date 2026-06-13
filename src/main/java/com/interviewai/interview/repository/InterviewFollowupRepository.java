package com.interviewai.interview.repository;

import com.interviewai.interview.entity.InterviewFollowup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewFollowupRepository
        extends JpaRepository<InterviewFollowup, Long> {
}