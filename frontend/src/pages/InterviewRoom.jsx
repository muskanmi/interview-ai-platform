import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    CircularProgress,
    LinearProgress,
    Stack,
    Alert,
    Chip,
} from "@mui/material";

import interviewApi from "../api/interviewApi";

function InterviewRoom() {

    const { sessionId } = useParams();

    const navigate = useNavigate();

    const hasFetched = useRef(false);

    const [question, setQuestion] = useState(null);

    const [answer, setAnswer] = useState("");

    const [status, setStatus] = useState(null);

    const [feedback, setFeedback] = useState(null);

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [followupQuestion, setFollowupQuestion] = useState(null);

    const [followupId, setFollowupId] = useState(null);

    const [followupAnswer, setFollowupAnswer] = useState("");

    const [followupFeedback, setFollowupFeedback] = useState(null);

    const [showFollowup, setShowFollowup] = useState(false);

    useEffect(() => {

        if (hasFetched.current) {
            return;
        }

        hasFetched.current = true;

        initializeInterview();

    }, []);

    const initializeInterview = async () => {

        try {

            const [questionResponse, statusResponse] =
                await Promise.all([
                    interviewApi.get(
                        `/api/interviews/${sessionId}/question`
                    ),
                    interviewApi.get(
                        `/api/interviews/${sessionId}/status`
                    ),
                ]);

            setQuestion(questionResponse.data);

            setStatus(statusResponse.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const loadNextQuestion = async () => {

        try {

            const response =
                await interviewApi.get(
                    `/api/interviews/${sessionId}/question`
                );

            setQuestion(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    const submitAnswer = async () => {

        if (!answer.trim()) return;

        try {

            setSubmitting(true);

            const answerResponse =
                await interviewApi.post(
                    `/api/interviews/${sessionId}/answer`,
                    {
                        answer,
                    }
                );

            setFeedback(answerResponse.data);

            const followupResponse =
                await interviewApi.post(
                    `/api/interviews/${sessionId}/followup`,
                    {
                        answer,
                    }
                );

            setFollowupQuestion(
                followupResponse.data.question
            );

            setFollowupId(
                followupResponse.data.followupId
            );

            setShowFollowup(true);

        } catch (error) {

            console.error(error);

        } finally {

            setSubmitting(false);

        }

    };

    if (loading) {

        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background:
                        "linear-gradient(135deg,#0f172a,#312e81)",
                }}
            >
                <CircularProgress
                    size={70}
                />
            </Box>
        );

    }

    const submitFollowupAnswer = async () => {

        if (!followupAnswer.trim()) return;

        try {

            setSubmitting(true);

            const response =
                await interviewApi.post(
                    `/api/interviews/followup/${followupId}/answer`,
                    {
                        answer: followupAnswer,
                    }
                );

            setFollowupFeedback(
                response.data
            );

            const statusResponse =
                await interviewApi.get(
                    `/api/interviews/${sessionId}/status`
                );

            const latestStatus =
                statusResponse.data;

            setStatus(latestStatus);

            if (
                latestStatus.completed
            ) {

                await interviewApi.post(
                    `/api/interviews/${sessionId}/complete`
                );

                navigate(
                    `/report/${sessionId}`
                );

                return;
            }

            const nextQuestionResponse =
                await interviewApi.get(
                    `/api/interviews/${sessionId}/question`
                );

            setQuestion(
                nextQuestionResponse.data
            );

            setAnswer("");

            setFollowupAnswer("");

            setFollowupQuestion(null);

            setFollowupFeedback(null);

            setShowFollowup(false);

            setFeedback(null);

        } catch (error) {

            console.error(error);

        } finally {

            setSubmitting(false);

        }

    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg,#0f172a,#312e81)",
                px: 3,
                py: 4,
            }}
        >
            <Paper
                elevation={12}
                sx={{
                    width: "100%",
                    maxWidth: "1600px",
                    mx: "auto",
                    p: 5,
                    borderRadius: 5,
                }}
            >
                <Typography
                    variant="h3"
                    fontWeight={800}
                    textAlign="center"
                    gutterBottom
                >
                    AI Mock Interview
                </Typography>

                {status && (
                    <>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                        >
                            <Typography
                                variant="body1"
                                fontWeight={700}
                            >
                                Question {status.currentQuestion} of{" "}
                                {status.totalQuestions}
                            </Typography>

                            <Chip
                                color="primary"
                                label={`${status.progress}% Complete`}
                            />
                        </Stack>

                        <LinearProgress
                            variant="determinate"
                            value={status.progress}
                            sx={{
                                height: 12,
                                borderRadius: 10,
                                mb: 4,
                            }}
                        />
                    </>
                )}

                {/* MAIN QUESTION */}

                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 3,
                        border: "1px solid #e2e8f0",
                        bgcolor: "#fafafa",
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >
                        Current Question
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: "1.1rem",
                            lineHeight: 1.9,
                        }}
                    >
                        {question?.question ||
                            question}
                    </Typography>
                </Paper>

                {/* ANSWER BOX */}

                <TextField
                    fullWidth
                    multiline
                    rows={8}
                    value={answer}
                    onChange={(e) =>
                        setAnswer(
                            e.target.value
                        )
                    }
                    placeholder="Write your answer here..."
                    sx={{
                        mb: 3,
                    }}
                />

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={submitAnswer}
                    disabled={submitting}
                    sx={{
                        py: 2,
                        fontWeight: 700,
                        fontSize: "1rem",
                        borderRadius: 3,
                    }}
                >
                    {submitting
                        ? "Evaluating..."
                        : "Submit Answer"}
                </Button>

                {submitting && (
                    <LinearProgress
                        sx={{
                            mt: 2,
                        }}
                    />
                )}

                {/* MAIN FEEDBACK */}

                {feedback && (
                    <Paper
                        elevation={3}
                        sx={{
                            mt: 5,
                            p: 4,
                            borderRadius: 4,
                            background:
                                "#f8fafc",
                        }}
                    >
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            gutterBottom
                        >
                            AI Feedback
                        </Typography>

                        <Chip
                            label={`Score : ${feedback.score}/10`}
                            color={
                                feedback.score >= 7
                                    ? "success"
                                    : feedback.score >= 4
                                        ? "warning"
                                        : "error"
                            }
                            sx={{
                                mb: 3,
                                fontWeight: 700,
                            }}
                        />

                        <Alert severity="info">
                            {feedback.feedback}
                        </Alert>
                    </Paper>
                )}

                {/* FOLLOWUP QUESTION */}

                {showFollowup && (
                    <Paper
                        elevation={4}
                        sx={{
                            mt: 5,
                            p: 4,
                            borderRadius: 4,
                            border: "2px solid #7c3aed",
                            background:
                                "#faf5ff",
                        }}
                    >
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            gutterBottom
                        >
                            Follow-up Question
                        </Typography>

                        <Alert
                            severity="warning"
                            sx={{
                                mb: 3,
                            }}
                        >
                            AI generated a deeper
                            follow-up question based
                            on your answer.
                        </Alert>

                        <Typography
                            variant="body1"
                            sx={{
                                mb: 3,
                                lineHeight: 1.8,
                                fontSize: "1.05rem",
                            }}
                        >
                            {followupQuestion}
                        </Typography>

                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            value={
                                followupAnswer
                            }
                            onChange={(e) =>
                                setFollowupAnswer(
                                    e.target.value
                                )
                            }
                            placeholder="Answer the follow-up question..."
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            sx={{
                                mt: 3,
                                py: 2,
                                fontWeight: 700,
                            }}
                            onClick={
                                submitFollowupAnswer
                            }
                        >
                            Submit Follow-up
                        </Button>
                    </Paper>
                )}

                {/* FOLLOWUP FEEDBACK */}

                {followupFeedback && (
                    <Paper
                        elevation={3}
                        sx={{
                            mt: 4,
                            p: 4,
                            borderRadius: 4,
                            background:
                                "#f8fafc",
                        }}
                    >
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            gutterBottom
                        >
                            Follow-up Feedback
                        </Typography>

                        <Chip
                            label={`Score : ${followupFeedback.score}/10`}
                            color={
                                followupFeedback.score >= 7
                                    ? "success"
                                    : followupFeedback.score >= 4
                                        ? "warning"
                                        : "error"
                            }
                            sx={{
                                mb: 3,
                            }}
                        />

                        <Alert severity="success">
                            {
                                followupFeedback.feedback
                            }
                        </Alert>
                    </Paper>
                )}
            </Paper>
        </Box>
    );
}

export default InterviewRoom;