import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Grid,
    Chip,
    Divider
} from "@mui/material";

import interviewApi from "../api/interviewApi";

function FinalReport() {

    const { sessionId } = useParams();

    const [report, setReport] =
        useState(null);

    useEffect(() => {

        loadReport();

    }, []);

    const loadReport = async () => {

        try {

            const response =
                await interviewApi.get(
                    `/api/interviews/${sessionId}/final-report`
                );

            setReport(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    if (!report) {

        return (
            <Box
                sx={{
                    minHeight: "100vh",
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
                elevation={12}
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
                    Interview Report
                </Typography>

                <Typography
                    color="text.secondary"
                    mb={4}
                >
                    AI Generated Performance Analysis
                </Typography>

                <Divider sx={{ mb: 4 }} />

                <Grid
                    container
                    spacing={3}
                    mb={4}
                >

                    <Grid item xs={12} md={4}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                textAlign: "center"
                            }}
                        >
                            <Typography
                                variant="h6"
                            >
                                Overall Score
                            </Typography>

                            <Chip
                                label={
                                    report.averageScore ??
                                    "N/A"
                                }
                                color="primary"
                                sx={{
                                    mt: 2,
                                    fontSize: "1rem"
                                }}
                            />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                textAlign: "center"
                            }}
                        >
                            <Typography
                                variant="h6"
                            >
                                Performance
                            </Typography>

                            <Chip
                                label={
                                    report.averageScore >= 8
                                        ? "Excellent"
                                        : report.averageScore >= 6
                                            ? "Good"
                                            : "Needs Improvement"
                                }
                                color={
                                    report.averageScore >= 8
                                        ? "success"
                                        : report.averageScore >= 6
                                            ? "warning"
                                            : "error"
                                }
                                sx={{
                                    mt: 2
                                }}
                            />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                textAlign: "center"
                            }}
                        >
                            <Typography
                                variant="h6"
                            >
                                Status
                            </Typography>

                            <Chip
                                label="Completed"
                                color="success"
                                sx={{ mt: 2 }}
                            />
                        </Paper>
                    </Grid>

                </Grid>

                <Paper
                    sx={{
                        p: 4,
                        mb: 4,
                        bgcolor: "#f8fafc"
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >
                        Strengths
                    </Typography>

                    <Typography>
                        {report.strengths ||
                            "No strengths available"}
                    </Typography>
                </Paper>

                <Paper
                    sx={{
                        p: 4,
                        mb: 4,
                        bgcolor: "#fff7ed"
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >
                        Areas For Improvement
                    </Typography>

                    <Typography>
                        {report.weaknesses ||
                            "No weaknesses available"}
                    </Typography>
                </Paper>

                <Paper
                    sx={{
                        p: 4,
                        bgcolor: "#ecfeff"
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >
                        AI Recommendations
                    </Typography>

                    <Typography>
                        {report.recommendations ||
                            "No recommendations available"}
                    </Typography>
                </Paper>

            </Paper>
        </Box>
    );
}

export default FinalReport;