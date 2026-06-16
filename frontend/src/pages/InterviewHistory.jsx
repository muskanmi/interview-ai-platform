import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Chip,
    Divider
} from "@mui/material";

import interviewApi from "../api/interviewApi";

function InterviewHistory() {

    const { sessionId } = useParams();

    const [history, setHistory] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        loadHistory();

    }, []);

    const loadHistory = async () => {

        try {

            const response =
                await interviewApi.get(
                    `/api/interviews/${sessionId}/history`
                );

            setHistory(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (
            <Box
                sx={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg,#0f172a,#312e81)",
                p: 5
            }}
        >
            <Paper
                elevation={10}
                sx={{
                    maxWidth: 1200,
                    mx: "auto",
                    p: 5,
                    borderRadius: 5
                }}
            >
                <Typography
                    variant="h3"
                    fontWeight={700}
                    gutterBottom
                >
                    Interview History
                </Typography>

                <Typography
                    color="text.secondary"
                    mb={4}
                >
                    Question-wise Performance Analysis
                </Typography>

                {history.map(
                    (item, index) => (
                        <Paper
                            key={index}
                            elevation={3}
                            sx={{
                                p: 4,
                                mb: 4,
                                borderRadius: 4
                            }}
                        >
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={2}
                            >
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                >
                                    Question {index + 1}
                                </Typography>

                                <Chip
                                    label={`${item.score}/10`}
                                    color={
                                        item.score >= 8
                                            ? "success"
                                            : item.score >= 6
                                                ? "warning"
                                                : "error"
                                    }
                                />
                            </Box>

                            <Typography
                                fontWeight={700}
                                mb={1}
                            >
                                Question
                            </Typography>

                            <Typography mb={3}>
                                {item.question}
                            </Typography>

                            <Divider sx={{ mb: 3 }} />

                            <Typography
                                fontWeight={700}
                                mb={1}
                            >
                                Your Answer
                            </Typography>

                            <Typography mb={3}>
                                {item.answer}
                            </Typography>

                            <Divider sx={{ mb: 3 }} />

                            <Typography
                                fontWeight={700}
                                mb={1}
                            >
                                AI Feedback
                            </Typography>

                            <Typography>
                                {item.feedback}
                            </Typography>

                        </Paper>
                    )
                )}
            </Paper>
        </Box>
    );
}

export default InterviewHistory;