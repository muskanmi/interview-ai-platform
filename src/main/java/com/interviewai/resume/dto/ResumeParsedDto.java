package com.interviewai.resume.dto;

public record ResumeParsedDto(
        String candidateName,
        String email,
        String phone,
        Double experience
) {
}