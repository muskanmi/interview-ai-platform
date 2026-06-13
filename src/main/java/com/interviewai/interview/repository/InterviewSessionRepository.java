package com.interviewai.interview.repository;

import com.interviewai.interview.entity.InterviewQuestion;
import com.interviewai.interview.entity.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {

}
