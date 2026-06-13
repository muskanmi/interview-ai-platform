package com.interviewai.interview.controller;

import com.interviewai.interview.dto.AnswerRequestDTO;
import com.interviewai.interview.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping("/start/{resumeId}")
    public ResponseEntity<?> startInterview(
            @PathVariable Long resumeId) {

        return ResponseEntity.ok(
                interviewService.startInterview(
                        resumeId));
    }

    @GetMapping("/{sessionId}/question")
    public ResponseEntity<?> getCurrentQuestion(
            @PathVariable Long sessionId) {

        return ResponseEntity.ok(
                interviewService.getCurrentQuestion(
                        sessionId
                )
        );
    }

    @PostMapping("/{sessionId}/answer")
    public ResponseEntity<?> submitAnswer(
            @PathVariable Long sessionId,
            @RequestBody AnswerRequestDTO request) {

        return ResponseEntity.ok(
                interviewService.submitAnswer(
                        sessionId,
                        request.getAnswer()
                )
        );
    }

    @GetMapping("/{sessionId}/status")
    public ResponseEntity<?> getStatus(
            @PathVariable Long sessionId) {

        return ResponseEntity.ok(
                interviewService.getStatus(sessionId)
        );
    }

    @GetMapping("/{sessionId}/report")
    public ResponseEntity<?> getReport(
            @PathVariable Long sessionId) {

        return ResponseEntity.ok(
                interviewService.getReport(
                        sessionId
                )
        );
    }

    @GetMapping("/{sessionId}/history")
    public ResponseEntity<?> getHistory(
            @PathVariable Long sessionId) {

        return ResponseEntity.ok(
                interviewService.getHistory(
                        sessionId
                )
        );
    }

    @GetMapping("/{sessionId}/dashboard")
    public ResponseEntity<?> getDashboard(
            @PathVariable Long sessionId) {

        return ResponseEntity.ok(
                interviewService.getDashboard(
                        sessionId
                )
        );
    }

    @PostMapping("/{sessionId}/followup")
    public ResponseEntity<?> generateFollowup(
            @PathVariable Long sessionId,
            @RequestBody AnswerRequestDTO request) {

        return ResponseEntity.ok(
                interviewService.generateFollowupQuestion(
                        sessionId,
                        request.getAnswer()
                )
        );
    }

    @PostMapping("/followup/{followupId}/answer")
    public ResponseEntity<?> submitFollowupAnswer(
            @PathVariable Long followupId,
            @RequestBody AnswerRequestDTO request) {

        return ResponseEntity.ok(
                interviewService.evaluateFollowupAnswer(
                        followupId,
                        request.getAnswer()
                )
        );
    }

    @PostMapping("/{sessionId}/complete")
    public ResponseEntity<?> completeInterview(
            @PathVariable Long sessionId) {

        return ResponseEntity.ok(
                interviewService.completeInterview(
                        sessionId
                )
        );
    }

    @GetMapping("/{sessionId}/final-report")
    public ResponseEntity<?> getFinalReport(
            @PathVariable Long sessionId) {

        return ResponseEntity.ok(
                interviewService.getFinalReport(
                        sessionId
                )
        );
    }
}
