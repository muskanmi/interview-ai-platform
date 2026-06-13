package com.interviewai.resume.service;

import com.interviewai.ai.dto.ResumeAnalysisDTO;
import com.interviewai.ai.service.ResumeAiService;
import com.interviewai.resume.entity.Resume;
import com.interviewai.resume.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ResumeServiceImpl
        implements ResumeService {

    private final ResumeRepository resumeRepository;
    private final ResumeParserService resumeParserService;
    private final ResumeAiService resumeAiService;

    @Override
    public Resume uploadResume(MultipartFile file) {

        try {

            PDDocument document =
                    Loader.loadPDF(file.getBytes());

            PDFTextStripper stripper =
                    new PDFTextStripper();

            String text =
                    stripper.getText(document);

//            System.out.println("========== PDF TEXT ==========");
//            System.out.println(text.substring(0, 200));
//            System.out.println("Length = " + text.length());
//            System.out.println("==============================");

            var parsedData =
                    resumeParserService.parseResume(text);

            Double experience = null;

            try {
                experience = resumeAiService.calculateExperience(text);
            } catch (Exception e) {
                System.out.println("Failed to calculate experience");
            }

            document.close();

            Resume resume =
                    Resume.builder()
                            .fileName(file.getOriginalFilename())
                            .candidateName(parsedData.candidateName())
                            .experience(experience)
                            .email(parsedData.email())
                            .phone(parsedData.phone())
                            .resumeText(text)
                            .uploadedAt(LocalDateTime.now())
                            .build();

            Resume saved = resumeRepository.save(resume);

//            System.out.println("Saved Resume Text = ");
//            System.out.println(saved.getResumeText().substring(0, 100));

            return saved;

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }

    @Override
    public ResumeAnalysisDTO analyzeResume(Long id) {
        Resume resume =
                resumeRepository.findById(id)
                        .orElseThrow();

        return resumeAiService.analyzeResume(
                resume.getResumeText());
    }
}
