package com.interviewai.resume.service;

import com.interviewai.resume.dto.ResumeParsedDto;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeParserServiceImpl
        implements ResumeParserService {

    @Override
    public ResumeParsedDto parseResume(String resumeText) {

        String email = extractEmail(resumeText);
        String phone = extractPhone(resumeText);
        String candidateName = extractName(resumeText);

        return new ResumeParsedDto(
                candidateName,
                email,
                phone,
                null
        );
    }

    private String extractEmail(String text) {

        Pattern pattern =
                Pattern.compile("[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+");

        Matcher matcher = pattern.matcher(text);

        return matcher.find() ? matcher.group() : null;
    }

    private String extractPhone(String text) {

        Pattern pattern =
                Pattern.compile("(\\+91)?\\s?[6-9]\\d{9}");

        Matcher matcher = pattern.matcher(text);

        return matcher.find() ? matcher.group() : null;
    }

    private String extractName(String text) {

        String[] lines = text.split("\\r?\\n");

        return lines.length > 0
                ? lines[0].trim()
                : null;
    }
}