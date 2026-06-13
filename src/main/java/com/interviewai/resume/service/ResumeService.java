package com.interviewai.resume.service;

import com.interviewai.ai.dto.ResumeAnalysisDTO;
import com.interviewai.resume.entity.Resume;
import org.springframework.web.multipart.MultipartFile;

public interface ResumeService {

    Resume uploadResume(MultipartFile file);

    ResumeAnalysisDTO analyzeResume(Long id);
}
