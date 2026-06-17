import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicIcon from "@mui/icons-material/Mic";
import SpeechRecognition,
{
    useSpeechRecognition
}
    from "react-speech-recognition";
import {
    Grid,Card,
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

    const webcamRef = useRef(null);
    const lastSpokenQuestion = useRef("");
    const [recording, setRecording] = useState(false);

    const {
        transcript,
        listening,
        resetTranscript,
    } =
        useSpeechRecognition();
    const {
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {

        return (
            <Typography>
                Browser does not support speech recognition.
            </Typography>
        );

    }

    const startListening = () => {

        SpeechRecognition.startListening({

            continuous: true,

            language: "en-US",

        });

    };

    const stopListening = () => {
        SpeechRecognition.stopListening();
        setRecording(false);
    };

    useEffect(() => {

        setAnswer(
            transcript
        );

    }, [transcript]);

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

            const statusResponse =
                await interviewApi.get(
                    `/api/interviews/${sessionId}/status`
                );

            const latestStatus =
                statusResponse.data;

            setStatus(latestStatus);

            if (latestStatus.completed) {

                await interviewApi.post(
                    `/api/interviews/${sessionId}/complete`
                );

                navigate(
                    `/dashboard/${sessionId}`
                );

                return;
            }

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

    const speakQuestion = (text) => {

        SpeechRecognition.stopListening();

        setRecording(false);

        window.speechSynthesis.cancel();

        const speech =
            new SpeechSynthesisUtterance(text);

        speech.rate = 1;
        speech.pitch = 1;

        window.speechSynthesis.speak(speech);
    };

    useEffect(() => {

        if (!question?.question) return;

        if (
            lastSpokenQuestion.current ===
            question.question
        ) {
            return;
        }

        lastSpokenQuestion.current =
            question.question;

        speakQuestion(
            question.question
        );

    }, [question]);

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
                    `/dashboard/${sessionId}`
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
                    <Box mb={5}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={1}
                        >
                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                Question {status.currentQuestion} of{" "}
                                {status.totalQuestions}
                            </Typography>

                            <Chip
                                label={`${status.progress}% Complete`}
                                color="primary"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: "0.9rem",
                                }}
                            />
                        </Stack>

                        <LinearProgress
                            variant="determinate"
                            value={status.progress}
                            sx={{
                                height: 12,
                                borderRadius: 20,

                                "& .MuiLinearProgress-bar": {
                                    borderRadius: 20,
                                },
                            }}
                        />
                    </Box>
                )}

                {/* VIDEO SECTION */}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "1fr 1fr",
                        },
                        gap: 3,
                        mb: 4,
                        pt: 2
                    }}
                >
                    {/* AI INTERVIEWER */}

                    <Paper
                        elevation={10}
                        sx={{
                            borderRadius: 5,
                            overflow: "hidden",
                            background:
                                "linear-gradient(135deg,#4f46e5,#7c3aed)",
                            color: "white",
                            minHeight: 350,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                        }}
                    >
                        <Box
                            sx={{
                                width: 140,
                                height: 140,
                                borderRadius: "50%",
                                bgcolor: "rgba(255,255,255,0.15)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "5rem",
                                animation:
                                    "pulse 2s infinite",
                            }}
                        >
                            🤖
                        </Box>

                        <Typography
                            variant="h4"
                            fontWeight={700}
                            mt={3}
                        >
                            AI Interviewer
                        </Typography>

                        <Chip
                            label="Speaking..."
                            color="success"
                            sx={{
                                mt: 2,
                                fontWeight: 700,
                            }}
                        />

                        <Typography
                            sx={{
                                mt: 2,
                                opacity: 0.9,
                            }}
                        >
                            Asking technical questions
                        </Typography>
                    </Paper>

                    {/* USER CAMERA */}

                    <Paper
                        elevation={10}
                        sx={{
                            borderRadius: 5,
                            overflow: "hidden",
                            position: "relative",
                            minHeight: 350,
                        }}
                    >
                        <Webcam
                            ref={webcamRef}
                            mirrored
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />

                        <Chip
                            icon={<VideocamIcon />}
                            label="LIVE"
                            color="success"
                            sx={{
                                position: "absolute",
                                top: 15,
                                left: 15,
                                fontWeight: 700,
                            }}
                        />

                        <Chip
                            icon={<MicIcon />}
                            label={
                                recording
                                    ? "Recording"
                                    : "Mic Off"
                            }
                            color={
                                recording
                                    ? "error"
                                    : "default"
                            }
                            sx={{
                                position: "absolute",
                                top: 15,
                                right: 15,
                                fontWeight: 700,
                            }}
                        />
                    </Paper>
                </Box>

                {/* QUESTION */}

                <Paper
                    elevation={8}
                    sx={{
                        p: 4,
                        mb: 3,
                        borderRadius: 5,
                        background:
                            "linear-gradient(180deg,#ffffff,#f8fafc)",
                        borderLeft:
                            "6px solid #6366f1",
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >
                        AI Question
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: "1.1rem",
                            lineHeight: 1.9,
                        }}
                    >
                        {question?.question || question}
                    </Typography>
                </Paper>

                {/* ANSWER */}

                <TextField
                    fullWidth
                    multiline
                    rows={8}
                    value={answer}
                    onChange={(e) =>
                        setAnswer(e.target.value)
                    }
                    placeholder="Speak or type your answer..."
                    sx={{
                        mb: 2,
                    }}
                />

                <Button
                    startIcon={<MicIcon />}
                    variant={
                        recording
                            ? "contained"
                            : "outlined"
                    }
                    color="error"
                    onClick={() => {
                        if (recording) {
                            stopListening();
                        } else {
                            resetTranscript();
                            startListening();
                            setRecording(true);
                        }
                    }}
                    sx={{
                        mb: 3,
                    }}
                >
                    {recording
                        ? "Stop Recording"
                        : "Start Speaking"}
                </Button>

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

                {/* FEEDBACK */}

                {feedback && (
                    <Paper
                        elevation={3}
                        sx={{
                            mt: 5,
                            p: 4,
                            borderRadius: 4,
                            background: "#f8fafc",
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

                {/* FOLLOWUP */}

                {showFollowup && (
                    <Paper
                        elevation={4}
                        sx={{
                            mt: 5,
                            p: 4,
                            borderRadius: 4,
                            border: "2px solid #7c3aed",
                            background: "#faf5ff",
                        }}
                    >
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            gutterBottom
                        >
                            Follow-up Question
                        </Typography>

                        <Typography
                            sx={{
                                mb: 3,
                                lineHeight: 1.8,
                            }}
                        >
                            {followupQuestion}
                        </Typography>

                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            value={followupAnswer}
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
                                mb: 2,
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