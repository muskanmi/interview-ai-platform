package com.interviewai.interview.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewai.ai.service.ResumeAiService;
import com.interviewai.interview.dto.*;
import com.interviewai.interview.entity.*;
import com.interviewai.interview.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewServiceImpl implements InterviewService {

    private final ResumeAiService resumeAiService;
    private final InterviewSessionRepository sessionRepository;
    private final InterviewQuestionRepository questionRepository;
    private final InterviewAnswerRepository answerRepository;
    private final InterviewFollowupRepository followupRepository;
    private final InterviewReportRepository interviewReportRepository;

    @Override
    public InterviewSession startInterview(
            Long resumeId) {

        List<String> questions =
                resumeAiService.generateQuestions(
                        resumeId);

        System.out.println(
                "Questions generated = "
                        + questions.size()
        );

        InterviewSession session =
                InterviewSession.builder()
                        .resumeId(resumeId)
                        .startedAt(LocalDateTime.now())
                        .currentQuestionIndex(0)
                        .completed(false)
                        .build();

        session =
                sessionRepository.save(session);

        int order = 1;

        for (String question : questions) {

            InterviewQuestion interviewQuestion =
                    InterviewQuestion.builder()
                            .sessionId(session.getId())
                            .question(question)
                            .questionOrder(order++)
                            .build();

            questionRepository.save(
                    interviewQuestion);
        }

        return session;
    }

    @Override
    public QuestionResponseDTO getCurrentQuestion(
            Long sessionId) {

        InterviewSession session =
                sessionRepository.findById(sessionId)
                        .orElseThrow();

        Integer currentIndex =
                session.getCurrentQuestionIndex();

        InterviewQuestion question =
                questionRepository
                        .findBySessionIdAndQuestionOrder(
                                sessionId,
                                currentIndex + 1
                        )
                        .orElseThrow();

        return QuestionResponseDTO.builder()
                .questionNumber(
                        currentIndex + 1
                )
                .question(
                        question.getQuestion()
                )
                .build();
    }

    @Override
    public AnswerEvaluationDTO submitAnswer(
            Long sessionId,
            String answer) {

        InterviewSession session =
                sessionRepository.findById(sessionId)
                        .orElseThrow();

        InterviewQuestion question =
                questionRepository
                        .findBySessionIdAndQuestionOrder(
                                sessionId,
                                session.getCurrentQuestionIndex() + 1
                        )
                        .orElseThrow();

        AnswerEvaluationDTO evaluation =
                resumeAiService.evaluateAnswer(
                        question.getQuestion(),
                        answer
                );

        evaluation.setQuestionCompleted(true);

        evaluation.setCurrentQuestionIndex(
                session.getCurrentQuestionIndex()
        );

        evaluation.setNextQuestionAvailable(
                session.getCurrentQuestionIndex() < 9
        );

        InterviewAnswer interviewAnswer =
                InterviewAnswer.builder()
                        .sessionId(sessionId)
                        .questionId(question.getId())
                        .answer(answer)
                        .score(evaluation.getScore())
                        .feedback(evaluation.getFeedback())
                        .answeredAt(LocalDateTime.now())
                        .build();

        answerRepository.save(interviewAnswer);

        session.setCurrentQuestionIndex(
                session.getCurrentQuestionIndex() + 1
        );

        sessionRepository.save(session);

        return evaluation;
    }

    @Override
    public InterviewStatusDTO getStatus(Long sessionId) {

        InterviewSession session =
                sessionRepository.findById(sessionId)
                        .orElseThrow();

        int totalQuestions =
                questionRepository
                        .findBySessionIdOrderByQuestionOrder(sessionId)
                        .size();

        int currentQuestion =
                session.getCurrentQuestionIndex() + 1;

        int progress =
                (session.getCurrentQuestionIndex() * 100)
                        / totalQuestions;

        return InterviewStatusDTO.builder()
                .sessionId(sessionId)
                .currentQuestion(currentQuestion)
                .totalQuestions(totalQuestions)
                .progress(progress)
                .completed(session.getCompleted())
                .build();
    }

    @Override
    public InterviewReportDTO getReport(
            Long sessionId) {

        List<InterviewAnswer> answers =
                answerRepository
                        .findBySessionId(sessionId);

        return resumeAiService
                .generateInterviewReport(
                        answers
                );
    }

    @Override
    public List<InterviewHistoryDTO> getHistory(
            Long sessionId) {

        List<InterviewAnswer> answers =
                answerRepository.findBySessionId(
                        sessionId
                );

        return answers.stream()
                .map(answer -> {

                    InterviewQuestion question =
                            questionRepository
                                    .findById(
                                            answer.getQuestionId()
                                    )
                                    .orElseThrow();

                    return InterviewHistoryDTO.builder()
                            .question(
                                    question.getQuestion()
                            )
                            .answer(
                                    answer.getAnswer()
                            )
                            .score(
                                    answer.getScore()
                            )
                            .feedback(
                                    answer.getFeedback()
                            )
                            .build();
                })
                .toList();
    }

    @Override
    public InterviewDashboardDTO getDashboard(
            Long sessionId) {

        InterviewSession session =
                sessionRepository
                        .findById(sessionId)
                        .orElseThrow();

        List<InterviewAnswer> answers =
                answerRepository.findBySessionId(
                        sessionId
                );

        List<InterviewQuestion> questions =
                questionRepository
                        .findBySessionIdOrderByQuestionOrder(
                                sessionId
                        );

        double avgScore =
                answers.stream()
                        .mapToInt(
                                InterviewAnswer::getScore
                        )
                        .average()
                        .orElse(0);

        return InterviewDashboardDTO.builder()
                .answeredQuestions(
                        answers.size()
                )
                .totalQuestions(
                        questions.size()
                )
                .averageScore(
                        avgScore
                )
                .completed(
                        session.getCompleted()
                )
                .build();
    }

    @Override
    public FollowupQuestionDTO generateFollowupQuestion(
            Long sessionId,
            String answer) {

        InterviewSession session =
                sessionRepository.findById(sessionId)
                        .orElseThrow();

        InterviewQuestion question =
                questionRepository
                        .findBySessionIdAndQuestionOrder(
                                sessionId,
                                session.getCurrentQuestionIndex() + 1
                        )
                        .orElseThrow();

        String followupQuestion =
                resumeAiService.generateFollowupQuestion(
                        question.getQuestion(),
                        answer
                );

        InterviewFollowup followup =
                InterviewFollowup.builder()
                        .sessionId(sessionId)
                        .questionId(question.getId())
                        .followupQuestion(followupQuestion)
                        .build();

        followupRepository.save(followup);

        return new FollowupQuestionDTO(
                followup.getId(),
                followupQuestion
        );
    }

    @Override
    public AnswerEvaluationDTO evaluateFollowupAnswer(
            Long followupId,
            String answer) {

        InterviewFollowup followup =
                followupRepository
                        .findById(followupId)
                        .orElseThrow();

        AnswerEvaluationDTO dto =
                resumeAiService.evaluateFollowupAnswer(
                        followup.getFollowupQuestion(),
                        answer
                );

        followup.setFollowupAnswer(answer);
        followup.setScore(dto.getScore());
        followup.setFeedback(dto.getFeedback());

        followupRepository.save(followup);

        return dto;
    }

    @Override
    public InterviewCompleteResponseDTO completeInterview(
            Long sessionId) {

        InterviewSession session =
                sessionRepository
                        .findById(sessionId)
                        .orElseThrow();

        InterviewReportDTO report =
                getReport(sessionId);

        session.setCompleted(true);

        sessionRepository.save(session);

        InterviewReport reportEntity =
                InterviewReport.builder()
                        .sessionId(sessionId)
                        .averageScore(report.getAverageScore())
                        .strengths(
                                String.join(
                                        ", ",
                                        report.getStrengths()
                                )
                        )
                        .weaknesses(
                                String.join(
                                        ", ",
                                        report.getWeaknesses()
                                )
                        )
                        .recommendations(
                                String.join(
                                        ", ",
                                        report.getRecommendations()
                                )
                        )
                        .overallSummary(report.getOverallSummary())
                        .technicalLevel(report.getTechnicalLevel())
                        .communicationLevel(report.getCommunicationLevel())
                        .hiringRecommendation(report.getHiringRecommendation())
                        .build();

        interviewReportRepository.save(
                reportEntity
        );

        return new InterviewCompleteResponseDTO(
                sessionId,
                true,
                "Interview completed successfully"
        );
    }

    @Override
    public InterviewReport getFinalReport(
            Long sessionId) {

        return interviewReportRepository
                .findBySessionId(sessionId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Final report not found"
                        )
                );
    }
}
