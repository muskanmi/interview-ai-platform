import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    Box,
    Typography,
    Paper,
    LinearProgress,
    Stack,
    Fade,
} from "@mui/material";

import { uploadResumeApi } from "../api/interviewApi";

const steps = [
    "📄 Resume Uploaded",
    "🔍 Extracting Resume Content",
    "🧠 Analyzing Skills & Experience",
    "🎯 Generating Interview Questions",
    "🚀 Building Personalized Assessment",
];

function LoadingScreen() {

    const location = useLocation();

    const navigate = useNavigate();

    const file = location.state?.file;

    const [currentStep, setCurrentStep] =
        useState(0);

    const [progress, setProgress] =
        useState(0);

    useEffect(() => {

        if (!file) {

            navigate("/");

            return;

        }

        processResume();

    }, []);

    const processResume = async () => {

        try {

            const interval =
                setInterval(() => {

                    setCurrentStep((prev) => {

                        if (
                            prev >=
                            steps.length - 1
                        ) {
                            return prev;
                        }

                        return prev + 1;

                    });

                }, 1800);

            const progressInterval =
                setInterval(() => {

                    setProgress((prev) => {

                        if (prev >= 95) {
                            return prev;
                        }

                        return prev + 5;

                    });

                }, 500);

            const response =
                await uploadResumeApi(file);

            clearInterval(interval);

            clearInterval(progressInterval);

            setCurrentStep(
                steps.length - 1
            );

            setProgress(100);

            setTimeout(() => {

                navigate(
                    `/analysis/${response.data.id}`
                );

            }, 1200);

        } catch (error) {

            console.error(error);

            navigate("/");

        }

    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg,#020617,#1e1b4b)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 3,
            }}
        >
            <Paper
                elevation={24}
                sx={{
                    width: "100%",
                    maxWidth: 900,
                    borderRadius: 6,
                    p: 6,
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 6,
                        background:
                            "linear-gradient(90deg,#2563eb,#7c3aed)",
                    }}
                />

                <Typography
                    variant="h2"
                    fontWeight={800}
                    textAlign="center"
                    gutterBottom
                >
                    🤖 AI Resume Intelligence
                </Typography>

                <Typography
                    variant="h6"
                    color="text.secondary"
                    textAlign="center"
                    sx={{
                        mb: 5,
                    }}
                >
                    Our AI is analyzing your resume
                    and preparing a personalized
                    interview experience
                </Typography>

                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 14,
                        borderRadius: 20,
                        mb: 3,
                    }}
                />

                <Typography
                    textAlign="center"
                    fontWeight={700}
                    color="primary"
                    mb={5}
                >
                    {progress}% Complete
                </Typography>

                <Stack spacing={2.5}>
                    {steps.map(
                        (
                            step,
                            index
                        ) => {

                            const completed =
                                index <
                                currentStep;

                            const active =
                                index ===
                                currentStep;

                            return (
                                <Fade
                                    in={
                                        index <=
                                        currentStep
                                    }
                                    timeout={
                                        700
                                    }
                                    key={
                                        index
                                    }
                                >
                                    <Box
                                        sx={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            gap: 2,
                                            p: 2.5,
                                            borderRadius:
                                                3,
                                            background:
                                                completed
                                                    ? "#f0fdf4"
                                                    : active
                                                        ? "#eff6ff"
                                                        : "#f8fafc",
                                            border:
                                                active
                                                    ? "2px solid #2563eb"
                                                    : "1px solid #e2e8f0",
                                            transition:
                                                "all .4s ease",
                                            transform:
                                                active
                                                    ? "scale(1.02)"
                                                    : "scale(1)",
                                        }}
                                    >
                                        {completed && (
                                            <Typography
                                                sx={{
                                                    fontSize:
                                                        "1.6rem",
                                                }}
                                            >
                                                ✅
                                            </Typography>
                                        )}

                                        {active && (
                                            <Box
                                                sx={{
                                                    width: 22,
                                                    height: 22,
                                                    border:
                                                        "3px solid #2563eb",
                                                    borderTop:
                                                        "3px solid transparent",
                                                    borderRadius:
                                                        "50%",
                                                    animation:
                                                        "spin 1s linear infinite",
                                                    "@keyframes spin":
                                                        {
                                                            "0%":
                                                                {
                                                                    transform:
                                                                        "rotate(0deg)",
                                                                },
                                                            "100%":
                                                                {
                                                                    transform:
                                                                        "rotate(360deg)",
                                                                },
                                                        },
                                                }}
                                            />
                                        )}

                                        {!completed &&
                                            !active && (
                                                <Typography>
                                                    ⏳
                                                </Typography>
                                            )}

                                        <Typography
                                            variant="h6"
                                            fontWeight={
                                                active
                                                    ? 700
                                                    : 500
                                            }
                                            color={
                                                completed
                                                    ? "success.main"
                                                    : active
                                                        ? "primary.main"
                                                        : "text.secondary"
                                            }
                                        >
                                            {
                                                step
                                            }
                                        </Typography>
                                    </Box>
                                </Fade>
                            );

                        }
                    )}
                </Stack>

                <Typography
                    textAlign="center"
                    color="text.secondary"
                    mt={5}
                    sx={{
                        fontSize:
                            "1rem",
                    }}
                >
                    This usually takes
                    10-20 seconds...
                </Typography>
            </Paper>
        </Box>
    );
}

export default LoadingScreen;