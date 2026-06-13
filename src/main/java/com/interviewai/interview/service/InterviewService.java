package com.interviewai.interview.service;

import com.interviewai.interview.dto.*;
import com.interviewai.interview.entity.InterviewReport;
import com.interviewai.interview.entity.InterviewSession;

import java.util.List;

public interface InterviewService {

    InterviewSession startInterview(
            Long resumeId);

    QuestionResponseDTO getCurrentQuestion(
            Long sessionId);

    AnswerEvaluationDTO submitAnswer(
            Long sessionId,
            String answer
    );

    InterviewStatusDTO getStatus(Long sessionId);

    InterviewReportDTO getReport(
            Long sessionId
    );

    List<InterviewHistoryDTO> getHistory(
            Long sessionId
    );

    InterviewDashboardDTO getDashboard(
            Long sessionId
    );

    FollowupQuestionDTO generateFollowupQuestion(
            Long sessionId,
            String answer);

    AnswerEvaluationDTO evaluateFollowupAnswer(
            Long followupId,
            String answer);

    InterviewCompleteResponseDTO completeInterview(
            Long sessionId
    );

    InterviewReport getFinalReport(
            Long sessionId
    );
}
