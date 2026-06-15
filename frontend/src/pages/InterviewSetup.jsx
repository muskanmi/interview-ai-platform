import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Stack,
    Chip,
} from "@mui/material";

import VideocamIcon from "@mui/icons-material/Videocam";
import MicIcon from "@mui/icons-material/Mic";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

function InterviewSetup() {

    const navigate = useNavigate();

    const { sessionId } = useParams();

    const videoRef = useRef(null);

    const [cameraReady, setCameraReady] =
        useState(false);

    const [micReady, setMicReady] =
        useState(false);

    const [stream, setStream] =
        useState(null);

    useEffect(() => {

        initializeCamera();

        return () => {

            if (stream) {

                stream
                    .getTracks()
                    .forEach(track =>
                        track.stop()
                    );

            }

        };

    }, []);

    const initializeCamera = async () => {

        try {

            const mediaStream =
                await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

            if (videoRef.current) {

                videoRef.current.srcObject =
                    mediaStream;

            }

            setStream(mediaStream);

            setCameraReady(true);

            setMicReady(true);

        } catch (error) {

            console.error(error);

        }

    };

    const startInterview = () => {

        navigate(
            `/interview/${sessionId}`
        );

    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg,#0f172a,#312e81)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 4,
            }}
        >
            <Card
                elevation={15}
                sx={{
                    width: "100%",
                    maxWidth: 1200,
                    borderRadius: 6,
                    overflow: "hidden",
                }}
            >
                <CardContent
                    sx={{
                        p: 5,
                    }}
                >
                    <Typography
                        variant="h3"
                        fontWeight={800}
                        textAlign="center"
                        gutterBottom
                    >
                        AI Interview Setup
                    </Typography>

                    <Typography
                        variant="h6"
                        color="text.secondary"
                        textAlign="center"
                        mb={4}
                    >
                        Verify your camera and microphone
                        before starting the interview
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mb: 4,
                        }}
                    >
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            style={{
                                width: "100%",
                                maxWidth: "800px",
                                height: "450px",
                                borderRadius: "20px",
                                objectFit: "cover",
                                background: "#000",
                            }}
                        />
                    </Box>

                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                        mb={5}
                    >
                        <Chip
                            icon={<VideocamIcon />}
                            label={
                                cameraReady
                                    ? "Camera Ready"
                                    : "Camera Not Detected"
                            }
                            color={
                                cameraReady
                                    ? "success"
                                    : "error"
                            }
                        />

                        <Chip
                            icon={<MicIcon />}
                            label={
                                micReady
                                    ? "Microphone Ready"
                                    : "Microphone Not Detected"
                            }
                            color={
                                micReady
                                    ? "success"
                                    : "error"
                            }
                        />
                    </Stack>

                    <Box
                        sx={{
                            bgcolor: "#f8fafc",
                            borderRadius: 4,
                            p: 4,
                            mb: 5,
                        }}
                    >
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            gutterBottom
                        >
                            Interview Instructions
                        </Typography>

                        <Typography
                            sx={{
                                lineHeight: 2,
                            }}
                        >
                            • Keep your camera turned on
                            throughout the interview.
                            <br />
                            • Answer each question clearly.
                            <br />
                            • AI will evaluate your technical
                            and communication skills.
                            <br />
                            • Ensure a quiet environment.
                            <br />
                            • The interview contains
                            personalized questions based on
                            your resume.
                        </Typography>
                    </Box>

                    <Box
                        display="flex"
                        justifyContent="center"
                    >
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={
                                <PlayArrowIcon />
                            }
                            disabled={
                                !cameraReady ||
                                !micReady
                            }
                            onClick={
                                startInterview
                            }
                            sx={{
                                px: 8,
                                py: 2,
                                fontSize: "1.1rem",
                                fontWeight: 700,
                                borderRadius: 4,
                            }}
                        >
                            Start Interview
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default InterviewSetup;