import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import interviewApi from "../api/interviewApi";

import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Typography,
    Stack,
    Paper,
    Grid,
    CircularProgress,
} from "@mui/material";

function ResumeAnalysis() {
    const { resumeId } = useParams();

    const [analysis, setAnalysis] = useState(null);

    const navigate = useNavigate();
    const [startingInterview, setStartingInterview] =
        useState(false);

    useEffect(() => {
        fetchAnalysis();
    }, []);

    const fetchAnalysis = async () => {
        try {
            const response = await interviewApi.get(
                `/api/resumes/${resumeId}/analysis`
            );

            setAnalysis(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    if (!analysis) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    background:
                        "linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#312e81 100%)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: 3,
                }}
            >
                <CircularProgress
                    size={70}
                    sx={{
                        color: "#fff",
                    }}
                />

                <Typography
                    variant="h6"
                    sx={{
                        color: "#fff",
                        fontWeight: 600,
                    }}
                >
                    Analyzing Resume...
                </Typography>
            </Box>
        );
    }

    const handleStartInterview = async () => {
        try {

            setStartingInterview(true);

            const response =
                await interviewApi.post(
                    `/api/interviews/start/${resumeId}`
                );

            const sessionId =
                response.data.sessionId ||
                response.data.id;

            navigate(
                `/setup/${sessionId}`
            );

        } catch (error) {
            console.error(error);
        } finally {
            setStartingInterview(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#312e81 100%)",
                py: 5,
            }}
        >
            <Container
                maxWidth={false}
                sx={{
                    px: {
                        xs: 2,
                        md: 6,
                        lg: 10,
                    },
                }}
            >
                {/* HERO SECTION */}

                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        mb: 4,
                        borderRadius: 5,
                        background:
                            "rgba(255,255,255,0.08)",
                        backdropFilter: "blur(20px)",
                        border:
                            "1px solid rgba(255,255,255,0.15)",
                        color: "white",
                        textAlign: "center",
                    }}
                >
                    <Typography
                        variant="h3"
                        fontWeight={800}
                    >
                        Resume Analysis Report
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1,
                            opacity: 0.8,
                            fontSize: "1.1rem",
                        }}
                    >
                        AI-Powered ATS & Interview Readiness Assessment
                    </Typography>
                </Paper>

                {/* STRENGTHS + WEAKNESSES */}

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                height: "100%",
                                borderRadius: 5,
                                background:
                                    "linear-gradient(135deg,#ecfdf5,#d1fae5)",
                                boxShadow:
                                    "0 20px 40px rgba(16,185,129,0.15)",
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    mb={3}
                                >
                                    💪 Strengths
                                </Typography>

                                <Stack spacing={2}>
                                    {analysis.strengths?.map(
                                        (
                                            item,
                                            index
                                        ) => (
                                            <Paper
                                                key={index}
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 3,
                                                    bgcolor:
                                                        "white",
                                                    borderLeft:
                                                        "5px solid #10b981",
                                                }}
                                            >
                                                <Typography>
                                                    {item}
                                                </Typography>
                                            </Paper>
                                        )
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                height: "100%",
                                borderRadius: 5,
                                background:
                                    "linear-gradient(135deg,#fff7ed,#ffedd5)",
                                boxShadow:
                                    "0 20px 40px rgba(249,115,22,0.15)",
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    mb={3}
                                >
                                    ⚠️ Weaknesses
                                </Typography>

                                <Stack spacing={2}>
                                    {analysis.weaknesses?.map(
                                        (
                                            item,
                                            index
                                        ) => (
                                            <Paper
                                                key={index}
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 3,
                                                    bgcolor:
                                                        "white",
                                                    borderLeft:
                                                        "5px solid #f97316",
                                                }}
                                            >
                                                <Typography>
                                                    {item}
                                                </Typography>
                                            </Paper>
                                        )
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* MISSING SKILLS */}

                <Card
                    sx={{
                        mt: 4,
                        borderRadius: 5,
                        background:
                            "linear-gradient(135deg,#fef2f2,#fee2e2)",
                        boxShadow:
                            "0 20px 40px rgba(239,68,68,0.12)",
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Typography
                            variant="h4"
                            fontWeight={700}
                            mb={3}
                        >
                            🚀 Missing Skills
                        </Typography>

                        <Grid container spacing={2}>
                            {analysis.missingSkills?.map(
                                (
                                    skill,
                                    index
                                ) => (
                                    <Grid
                                        item
                                        xs={12}
                                        md={4}
                                        key={index}
                                    >
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2.5,
                                                textAlign:
                                                    "center",
                                                borderRadius: 3,
                                                bgcolor:
                                                    "white",
                                                fontWeight: 600,
                                                height:
                                                    "100%",
                                            }}
                                        >
                                            {skill}
                                        </Paper>
                                    </Grid>
                                )
                            )}
                        </Grid>
                    </CardContent>
                </Card>

                {/* AI RECOMMENDATIONS */}

                <Card
                    sx={{
                        mt: 4,
                        borderRadius: 5,
                        background: "#fff",
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Typography
                            variant="h4"
                            fontWeight={700}
                            mb={3}
                        >
                            🤖 AI Recommendations
                        </Typography>

                        <Stack spacing={2}>
                            {analysis.suggestions?.map(
                                (
                                    item,
                                    index
                                ) => (
                                    <Paper
                                        key={index}
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: 3,
                                            background:
                                                "#f8fafc",
                                            borderLeft:
                                                "6px solid #6366f1",
                                        }}
                                    >
                                        <Typography>
                                            {item}
                                        </Typography>
                                    </Paper>
                                )
                            )}
                        </Stack>
                    </CardContent>
                </Card>

                {/* BUTTON */}

                <Box
                    display="flex"
                    justifyContent="center"
                    mt={5}
                >
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleStartInterview}
                        sx={{
                            px: 8,
                            py: 2,
                            borderRadius: 4,
                            background:
                                "linear-gradient(135deg,#6366f1,#8b5cf6)",
                            fontSize: "1rem",
                            fontWeight: 700,
                            textTransform: "none",
                            boxShadow:
                                "0 15px 40px rgba(99,102,241,0.4)",

                            "&:hover": {
                                background:
                                    "linear-gradient(135deg,#4f46e5,#7c3aed)",
                                transform:
                                    "translateY(-2px)",
                            },
                        }}
                    >
                        {
                            startingInterview
                                ? "Preparing Interview..."
                                : "🚀 Start Mock Interview"
                        }
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default ResumeAnalysis;