import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    Box,
    Paper,
    Typography,
    Grid,
    CircularProgress,
    LinearProgress,
    Chip
} from "@mui/material";

import interviewApi from "../api/interviewApi";

function Dashboard() {

    const { sessionId } = useParams();

    const [dashboard, setDashboard] =
        useState(null);

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const response =
                await interviewApi.get(
                    `/api/interviews/${sessionId}/dashboard`
                );

            setDashboard(
                response.data
            );

        } catch (error) {

            console.error(error);

        }

    };

    if (!dashboard) {

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

    const progress =
        dashboard.totalQuestions > 0
            ? (
            dashboard.answeredQuestions /
            dashboard.totalQuestions
        ) * 100
            : 0;

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
                    Interview Dashboard
                </Typography>

                <Typography
                    color="text.secondary"
                    mb={4}
                >
                    AI Interview Analytics
                </Typography>

                <Grid
                    container
                    spacing={3}
                >

                    <Grid item xs={12} md={3}>
                        <Paper
                            elevation={4}
                            sx={{
                                p: 3,
                                textAlign: "center"
                            }}
                        >
                            <Typography
                                variant="h6"
                            >
                                Answered
                            </Typography>

                            <Typography
                                variant="h3"
                                fontWeight={700}
                            >
                                {dashboard.answeredQuestions}
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Paper
                            elevation={4}
                            sx={{
                                p: 3,
                                textAlign: "center"
                            }}
                        >
                            <Typography
                                variant="h6"
                            >
                                Total Questions
                            </Typography>

                            <Typography
                                variant="h3"
                                fontWeight={700}
                            >
                                {dashboard.totalQuestions}
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Paper
                            elevation={4}
                            sx={{
                                p: 3,
                                textAlign: "center"
                            }}
                        >
                            <Typography
                                variant="h6"
                            >
                                Average Score
                            </Typography>

                            <Typography
                                variant="h3"
                                fontWeight={700}
                                color="primary"
                            >
                                {dashboard.averageScore?.toFixed(1)}
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Paper
                            elevation={4}
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
                                label={
                                    dashboard.completed
                                        ? "Completed"
                                        : "In Progress"
                                }
                                color={
                                    dashboard.completed
                                        ? "success"
                                        : "warning"
                                }
                                sx={{
                                    mt: 2
                                }}
                            />
                        </Paper>
                    </Grid>

                </Grid>

                <Paper
                    elevation={4}
                    sx={{
                        p: 4,
                        mt: 5
                    }}
                >
                    <Typography
                        variant="h5"
                        gutterBottom
                    >
                        Interview Progress
                    </Typography>

                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 15,
                            borderRadius: 10,
                            mt: 2
                        }}
                    />

                    <Typography
                        mt={2}
                    >
                        {dashboard.answeredQuestions}
                        {" / "}
                        {dashboard.totalQuestions}
                        {" Questions Completed"}
                    </Typography>
                </Paper>

            </Paper>
        </Box>
    );
}

export default Dashboard;