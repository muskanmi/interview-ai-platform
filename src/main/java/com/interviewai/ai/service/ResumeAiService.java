package com.interviewai.ai.service;

import com.interviewai.ai.dto.ResumeAnalysisDTO;
import com.interviewai.interview.dto.AnswerEvaluationDTO;
import com.interviewai.interview.dto.InterviewReportDTO;
import com.interviewai.interview.entity.InterviewAnswer;

import java.util.List;

public interface ResumeAiService {

    Double calculateExperience(String resumeText);

    ResumeAnalysisDTO analyzeResume(String resumeText);

    List<String> generateQuestions(Long resumeId);

    AnswerEvaluationDTO evaluateAnswer(
            String question,
            String answer
    );

    InterviewReportDTO generateInterviewReport(
            List<InterviewAnswer> answers
    );

    String generateFollowupQuestion(
            String question,
            String answer
    );

    AnswerEvaluationDTO evaluateFollowupAnswer(
            String question,
            String answer
    );
}
