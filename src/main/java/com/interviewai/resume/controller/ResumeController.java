package com.interviewai.resume.controller;

import com.interviewai.resume.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(
            @RequestParam MultipartFile file) {

        return ResponseEntity.ok(
                resumeService.uploadResume(file));
    }

    @GetMapping("/{id}/analysis")
    public ResponseEntity<?> analyzeResume(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                resumeService.analyzeResume(id));
    }
}
