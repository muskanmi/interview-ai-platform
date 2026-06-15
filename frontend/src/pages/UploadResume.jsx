import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Typography,
    Stack,
    Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";

export default function UploadResume() {

    const [file, setFile] = useState(null);

    const navigate = useNavigate();

    const uploadResume = () => {

        if (!file) {
            return;
        }

        navigate("/loading", {
            state: {
                file,
            },
        });

    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 3,
            }}
        >
            <Container maxWidth="md">
                <Card
                    elevation={15}
                    sx={{
                        borderRadius: 6,
                        p: 3,
                        backdropFilter: "blur(20px)",
                    }}
                >
                    <CardContent>
                        <Stack
                            spacing={4}
                            alignItems="center"
                        >
                            <Typography
                                variant="h3"
                                fontWeight={800}
                                textAlign="center"
                            >
                                🤖 AI Mock Interview
                            </Typography>

                            <Typography
                                variant="h6"
                                color="text.secondary"
                                textAlign="center"
                            >
                                Upload your resume and let AI generate
                                personalized interview questions,
                                feedback, and career insights.
                            </Typography>

                            <Button
                                component="label"
                                variant="outlined"
                                size="large"
                                startIcon={
                                    <CloudUploadIcon />
                                }
                                sx={{
                                    minWidth: 250,
                                    height: 60,
                                    borderRadius: 3,
                                    fontWeight: 700,
                                }}
                            >
                                Choose Resume

                                <input
                                    hidden
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) =>
                                        setFile(
                                            e.target
                                                .files?.[0]
                                        )
                                    }
                                />
                            </Button>

                            {file && (
                                <Chip
                                    icon={
                                        <DescriptionIcon />
                                    }
                                    label={file.name}
                                    color="success"
                                    sx={{
                                        fontSize:
                                            "0.95rem",
                                        p: 2.5,
                                    }}
                                />
                            )}

                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                onClick={
                                    uploadResume
                                }
                                disabled={!file}
                                sx={{
                                    py: 2,
                                    borderRadius: 3,
                                    fontSize:
                                        "1rem",
                                    fontWeight: 700,
                                    textTransform:
                                        "none",
                                    maxWidth: 500,
                                }}
                            >
                                Upload Resume &
                                Start Analysis
                            </Button>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                textAlign="center"
                            >
                                Supported format:
                                PDF • AI Analysis
                                takes approximately
                                10-20 seconds
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}