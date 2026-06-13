import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Typography,
    Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { uploadResumeApi } from "../api/interviewApi";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function UploadResume() {
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const uploadResume = async () => {
        if (!file) return;
        console.log("button clicked")

        try {
            setLoading(true);

            const response =
                await uploadResumeApi(file);
            console.log(response, "rrrrrr");

            console.log(response.data);

            navigate(
                `/analysis/${response.data.id}`
            );

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
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
            }}
        >
            <Container maxWidth="md">
                <Card
                    elevation={10}
                    sx={{
                        borderRadius: 5,
                        p: 4,
                    }}
                >
                    <CardContent>
                        <Stack spacing={4} alignItems="center">
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                textAlign="center"
                            >
                                AI Mock Interview
                            </Typography>

                            <Typography
                                variant="h6"
                                color="text.secondary"
                                textAlign="center"
                            >
                                Upload your resume and start an
                                AI-powered interview experience
                            </Typography>

                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<CloudUploadIcon />}
                                size="large"
                            >
                                Choose Resume

                                <input
                                    hidden
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) =>
                                        setFile(e.target.files[0])
                                    }
                                />
                            </Button>

                            {file && (
                                <Typography>
                                    Selected: {file.name}
                                </Typography>
                            )}

                            <Button
                                variant="contained"
                                size="large"
                                onClick={uploadResume}
                                sx={{
                                    px: 5,
                                    py: 1.5,
                                }}
                            >
                                Upload Resume
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}