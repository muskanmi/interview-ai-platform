package com.interviewai.ai.controller;

import com.interviewai.ai.service.ResumeAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
public class InterviewAiController {

    private final ResumeAiService resumeAiService;

    @GetMapping("/questions/{resumeId}")
    public ResponseEntity<?> generateQuestions(
            @PathVariable Long resumeId) {

        return ResponseEntity.ok(
                resumeAiService.generateQuestions(resumeId)
        );
    }
}
