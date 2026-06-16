package com.interviewai.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewai.ai.dto.QuestionDTO;
import com.interviewai.ai.dto.ResumeAnalysisDTO;
import com.interviewai.interview.dto.AnswerEvaluationDTO;
import com.interviewai.interview.dto.InterviewReportDTO;
import com.interviewai.interview.entity.InterviewAnswer;
import com.interviewai.interview.entity.InterviewQuestion;
import com.interviewai.interview.repository.InterviewQuestionRepository;
import com.interviewai.resume.entity.Resume;
import com.interviewai.resume.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResumeAiServiceImpl implements ResumeAiService {

    private final ChatClient chatClient;
    private final ResumeRepository resumeRepository;
    private final ObjectMapper objectMapper;
    private final InterviewQuestionRepository questionRepository;

    @Override
    public Double calculateExperience(String resumeText) {
        String prompt = """
                Analyze the resume and calculate the candidate's total professional experience in years.
                
                Rules:
                - Return ONLY a decimal number.
                - No explanation.
                - No units.
                - No text.
                - Example outputs:
                4.5
                2.0
                7.8
                
                Resume:
                %s
                """.formatted(resumeText);

        String response =
                chatClient.prompt(prompt)
                        .call()
                        .content();

        System.out.println("AI Experience = " + response);

        try {
            return Double.parseDouble(response.trim());
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public ResumeAnalysisDTO analyzeResume(String resumeText) {

        String prompt = """
                Analyze this resume.
                
                Return ONLY valid JSON.
                
                DO NOT wrap the response inside markdown.
                DO NOT use ```json.
                DO NOT provide explanations.
                
                Return exactly this format:
                
                {
                  "strengths": [],
                  "weaknesses": [],
                  "missingSkills": [],
                  "suggestions": []
                }
                
                Resume:
                %s
                """.formatted(resumeText);

        String response =
                chatClient.prompt(prompt)
                        .call()
                        .content();

        System.out.println("AI Analysis = ");
        System.out.println(response);

        try {

            ObjectMapper objectMapper =
                    new ObjectMapper();

            return objectMapper.readValue(
                    response,
                    ResumeAnalysisDTO.class
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to parse AI response",
                    e
            );
        }
    }

    @Override
    public List<String> generateQuestions(Long resumeId) {
        Resume resume =
                resumeRepository.findById(resumeId)
                        .orElseThrow();

        String prompt = """
                    Analyze the candidate resume.
                    
                    Identify:
                    - Primary Technology Stack
                    - Experience Level
                    - Projects
                    - Skills
                    
                    Act as a senior interviewer for the candidate's actual domain.
                    
                    Rules:
                    
                    1. Ask one question at a time.
                    2. Behave like a real interviewer.
                    3. Ask scenario-based production questions.
                    4. Do not reveal answers.
                    5. Keep drilling deeper based on candidate profile.
                    6. Ask follow-up questions like top service-based and product-based companies.
                    7. Focus heavily on technologies found in the resume.
                    8. Challenge incomplete answers.
                    9. Maintain interviewer tone.
                    10. Generate the first 2 interview questions.
                    
                    IMPORTANT:
                    Return ONLY raw JSON.
                    Do NOT wrap in markdown.
                    Do NOT use ```json.
                    Do NOT use ```.
                    
                    Return exactly:
                    {
                      "questions": [
                        "...",
                        "..."
                      ]
                    }
                    
                    Resume:
                    
                    %s
                    """
                .formatted(resume.getResumeText());


        String response =
                chatClient.prompt(prompt)
                        .call()
                        .content();

        try {

            QuestionDTO dto =
                    objectMapper.readValue(
                            response,
                            QuestionDTO.class
                    );

            return dto.getQuestions();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to parse AI questions",
                    e
            );
        }
    }

    @Override
    public AnswerEvaluationDTO evaluateAnswer(
            String question,
            String answer) {

        String prompt = """
                Evaluate the answer.
                
                Return ONLY valid JSON.
                
                DO NOT use markdown.
                DO NOT use ```json
                DO NOT use backticks.
                DO NOT explain anything.
                
                Return exactly:
                
                {
                  "score": 0,
                  "feedback": ""
                }
                
                Question:
                %s
                
                Answer:
                %s
                """.formatted(question, answer);

        String response =
                chatClient.prompt(prompt)
                        .call()
                        .content();

        try {

            System.out.println("AI RESPONSE = ");
            System.out.println(response);

            return objectMapper.readValue(
                    response,
                    AnswerEvaluationDTO.class
            );

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }

    @Override
    public InterviewReportDTO generateInterviewReport(
            List<InterviewAnswer> answers) {

        StringBuilder transcript =
                new StringBuilder();

        for (InterviewAnswer answer : answers) {

            InterviewQuestion question =
                    questionRepository
                            .findById(answer.getQuestionId())
                            .orElseThrow();

            transcript.append(
                    "Question: "
                            + question.getQuestion()
                            + "\n"
            );

            transcript.append(
                    "Answer: "
                            + answer.getAnswer()
                            + "\n"
            );

            transcript.append(
                    "Score: "
                            + answer.getScore()
                            + "\n\n"
            );
        }

        String prompt = """
            Analyze this interview.
            
            Return JSON only.
            
                {
                   "averageScore": 0,
                   "technicalLevel": "",
                   "communicationLevel": "",
                   "hiringRecommendation": "",
                   "overallSummary": "",
                   "strengths": [],
                   "weaknesses": [],
                   "recommendations": []
                 }
            
            Interview:
            
            %s
            """
                .formatted(transcript);

        String response =
                chatClient.prompt(prompt)
                        .call()
                        .content();

        response = response
                .replace("```json", "")
                .replace("```", "")
                .trim();

        try {

            ObjectMapper mapper =
                    new ObjectMapper();

            return mapper.readValue(
                    response,
                    InterviewReportDTO.class
            );

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }

    @Override
    public String generateFollowupQuestion(
            String question,
            String answer) {

        String prompt = """
            You are a senior Java interviewer.

            Original Question:
            %s

            Candidate Answer:
            %s

            Generate exactly ONE follow-up question.

            Return only question text.
            """
                .formatted(question, answer);

        return chatClient.prompt(prompt)
                .call()
                .content();
    }

    @Override
    public AnswerEvaluationDTO evaluateFollowupAnswer(
            String question,
            String answer) {

        String prompt = """
            Evaluate this follow-up interview answer.

            Question:
            %s

            Answer:
            %s

            Return JSON only:

            {
              "score": 0,
              "feedback": ""
            }
            """
                .formatted(question, answer);

        String response =
                chatClient.prompt(prompt)
                        .call()
                        .content();

        response = response
                .replace("```json", "")
                .replace("```", "")
                .trim();

        try {

            ObjectMapper mapper =
                    new ObjectMapper();

            return mapper.readValue(
                    response,
                    AnswerEvaluationDTO.class
            );

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }
}
