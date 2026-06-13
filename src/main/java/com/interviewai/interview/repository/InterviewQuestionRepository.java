package com.interviewai.interview.repository;

import com.interviewai.interview.entity.InterviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewQuestionRepository
        extends JpaRepository<InterviewQuestion, Long> {

    List<InterviewQuestion> findBySessionIdOrderByQuestionOrder(
            Long sessionId);

    Optional<InterviewQuestion>
    findBySessionIdAndQuestionOrder(
            Long sessionId,
            Integer questionOrder
    );
}
