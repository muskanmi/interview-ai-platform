package com.interviewai.resume.service;

import com.interviewai.resume.dto.ResumeParsedDto;

public interface ResumeParserService {

    ResumeParsedDto parseResume(String resumeText);
}