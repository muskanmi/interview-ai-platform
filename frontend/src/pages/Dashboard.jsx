import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    Box,
    Paper,
    Typography,
    Grid,
    CircularProgress,
    LinearProgress,
    Chip,   Button,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TimelineIcon from "@mui/icons-material/Timeline";
import interviewApi from "../api/interviewApi";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";
import ReplayIcon from "@mui/icons-material/Replay";

import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Dashboard() {

    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);

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
            const historyResponse =
                await interviewApi.get(
                    `/api/interviews/${sessionId}/history`
                );

            setHistory(
                historyResponse.data
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

    const performanceLabel =
        dashboard.averageScore >= 8
            ? "Excellent"
            : dashboard.averageScore >= 6
                ? "Good"
                : dashboard.averageScore >= 4
                    ? "Average"
                    : "Needs Improvement";

    const performanceColor =
        dashboard.averageScore >= 8
            ? "#10b981"
            : dashboard.averageScore >= 6
                ? "#3b82f6"
                : dashboard.averageScore >= 4
                    ? "#f59e0b"
                    : "#ef4444";

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg,#020617,#1e1b4b,#312e81)",
                p: 5
            }}
        >
            <Paper
                id="dashboard-content"
                elevation={20}
                sx={{
                    maxWidth: 1200,
                    mx: "auto",
                    p: 5,
                    borderRadius: 5,
                    background:
                        "rgba(255,255,255,0.95)",
                    backdropFilter:
                        "blur(20px)",
                    boxShadow:
                        "0 20px 60px rgba(0,0,0,0.25)"
                }}
            >
                <Typography
                    variant="h3"
                    fontWeight={700}
                    gutterBottom
                >
                    Interview Dashboard
                </Typography>

                <Paper
                    elevation={0}
                    sx={{
                        mt:4,
                        mb:4,
                        p:4,
                        borderRadius:5,
                        background:
                            "linear-gradient(135deg,#4f46e5,#7c3aed)",
                        color:"white"
                    }}
                >

                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        AI Interview Performance Report
                    </Typography>

                    <Typography
                        sx={{
                            mt:2,
                            opacity:0.9
                        }}
                    >
                        Candidate performance has been
                        evaluated using AI-driven analysis
                        covering technical depth,
                        communication,
                        problem solving,
                        and system design.
                    </Typography>

                </Paper>

                <Typography
                    color="text.secondary"
                    mb={4}
                >
                    AI Interview Analytics
                </Typography>

                <Grid
                    container
                    spacing={3}
                    sx={{
                        width: "100%",
                        mt: 2,
                        mb: 2
                    }}
                >
                    {/* Card 1 */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            sx={{
                                p: 3,
                                height: 180,
                                borderRadius: 4,
                                background:
                                    "linear-gradient(135deg,#2563eb,#3b82f6)",
                                color: "white",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between"
                            }}
                        >
                            <Typography fontSize={14}>
                                QUESTIONS ANSWERED
                            </Typography>

                            <Typography
                                variant="h2"
                                fontWeight={700}
                            >
                                {dashboard.answeredQuestions}
                            </Typography>

                            <Typography>
                                Completed
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Card 2 */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            sx={{
                                p: 3,
                                height: 180,
                                borderRadius: 4,
                                background:
                                    "linear-gradient(135deg,#0f172a,#1e293b)",
                                color: "white",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between"
                            }}
                        >
                            <Typography fontSize={14}>
                                TOTAL QUESTIONS
                            </Typography>

                            <Typography
                                variant="h2"
                                fontWeight={700}
                            >
                                {dashboard.totalQuestions}
                            </Typography>

                            <Typography>
                                Interview Set
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Card 3 */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            sx={{
                                p: 3,
                                height: 180,
                                borderRadius: 4,
                                background:
                                    "linear-gradient(135deg,#7c3aed,#a855f7)",
                                color: "white",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between"
                            }}
                        >
                            <Typography fontSize={14}>
                                AVERAGE SCORE
                            </Typography>

                            <Typography
                                variant="h2"
                                fontWeight={700}
                            >
                                {dashboard.averageScore?.toFixed(1)}
                            </Typography>

                            <Typography>
                                Out of 10
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Card 4 */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            sx={{
                                p: 3,
                                height: 180,
                                borderRadius: 4,
                                background:
                                    "linear-gradient(135deg,#059669,#10b981)",
                                color: "white",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between"
                            }}
                        >
                            <Typography fontSize={14}>
                                STATUS
                            </Typography>

                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                {dashboard.completed
                                    ? "Completed"
                                    : "In Progress"}
                            </Typography>

                            <Typography>
                                Interview State
                            </Typography>
                        </Paper>
                    </Grid>

                </Grid>

                {/*<Grid*/}
                {/*    container*/}
                {/*    spacing={3}*/}
                {/*>*/}

                {/*    <Grid item xs={12} md={3}>*/}
                {/*        <Paper*/}
                {/*            elevation={4}*/}
                {/*            sx={{*/}
                {/*                p: 3,*/}
                {/*                textAlign: "center"*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            <Typography*/}
                {/*                variant="h6"*/}
                {/*            >*/}
                {/*                Answered*/}
                {/*            </Typography>*/}

                {/*            <Typography*/}
                {/*                variant="h3"*/}
                {/*                fontWeight={700}*/}
                {/*            >*/}
                {/*                {dashboard.answeredQuestions}*/}
                {/*            </Typography>*/}
                {/*        </Paper>*/}
                {/*    </Grid>*/}

                {/*    <Grid item xs={12} md={3}>*/}
                {/*        <Paper*/}
                {/*            elevation={4}*/}
                {/*            sx={{*/}
                {/*                p: 3,*/}
                {/*                textAlign: "center"*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            <Typography*/}
                {/*                variant="h6"*/}
                {/*            >*/}
                {/*                Total Questions*/}
                {/*            </Typography>*/}

                {/*            <Typography*/}
                {/*                variant="h3"*/}
                {/*                fontWeight={700}*/}
                {/*            >*/}
                {/*                {dashboard.totalQuestions}*/}
                {/*            </Typography>*/}
                {/*        </Paper>*/}
                {/*    </Grid>*/}

                {/*    <Grid item xs={12} md={3}>*/}
                {/*        <Paper*/}
                {/*            elevation={4}*/}
                {/*            sx={{*/}
                {/*                p: 3,*/}
                {/*                textAlign: "center"*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            <Typography*/}
                {/*                variant="h6"*/}
                {/*            >*/}
                {/*                Average Score*/}
                {/*            </Typography>*/}

                {/*            <Typography*/}
                {/*                variant="h3"*/}
                {/*                fontWeight={700}*/}
                {/*                color="primary"*/}
                {/*            >*/}
                {/*                {dashboard.averageScore?.toFixed(1)}*/}
                {/*            </Typography>*/}
                {/*        </Paper>*/}
                {/*    </Grid>*/}

                {/*    <Grid item xs={12} md={3}>*/}
                {/*        <Paper*/}
                {/*            elevation={4}*/}
                {/*            sx={{*/}
                {/*                p: 3,*/}
                {/*                textAlign: "center"*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            <Typography*/}
                {/*                variant="h6"*/}
                {/*            >*/}
                {/*                Status*/}
                {/*            </Typography>*/}

                {/*            <Chip*/}
                {/*                label={*/}
                {/*                    dashboard.completed*/}
                {/*                        ? "Completed"*/}
                {/*                        : "In Progress"*/}
                {/*                }*/}
                {/*                color={*/}
                {/*                    dashboard.completed*/}
                {/*                        ? "success"*/}
                {/*                        : "warning"*/}
                {/*                }*/}
                {/*                sx={{*/}
                {/*                    mt: 2*/}
                {/*                }}*/}
                {/*            />*/}
                {/*        </Paper>*/}
                {/*    </Grid>*/}

                {/*</Grid>*/}





                <Grid
                    container
                    spacing={3}
                    mt={2}
                >
                    <Grid item xs={12} md={4}>

                        <Paper
                            elevation={0}
                            sx={{
                                height: 350,
                                borderRadius: 6,
                                background:
                                    "linear-gradient(135deg,#4f46e5,#7c3aed)",
                                color: "white",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                boxShadow:
                                    "0 20px 50px rgba(99,102,241,0.35)"
                            }}
                        >

                            <Box
                                sx={{
                                    width: 170,
                                    height: 170,
                                    borderRadius: "50%",
                                    background:
                                        `conic-gradient(
                        white ${dashboard.averageScore * 36}deg,
                        rgba(255,255,255,.15) 0deg
                    )`,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >

                                <Box
                                    sx={{
                                        width: 130,
                                        height: 130,
                                        borderRadius: "50%",
                                        bgcolor: "#5b4cf3",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <Typography
                                        variant="h2"
                                        fontWeight={800}
                                        color="white"
                                    >
                                        {dashboard.averageScore}
                                    </Typography>

                                    <Typography color="white">
                                        Score
                                    </Typography>

                                </Box>

                            </Box>

                            <Typography
                                variant="h5"
                                mt={3}
                                fontWeight={700}
                                pt={4}
                            >
                                Overall Performance
                            </Typography>

                        </Paper>

                    </Grid>

                    <Grid item xs={12} md={8}>

                        <Paper
                            elevation={0}
                            sx={{
                                height: 350,
                                borderRadius: 6,
                                background:
                                    "linear-gradient(135deg,#4f46e5,#7c3aed)",
                                color: "white",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 3,
                                boxShadow:
                                    "0 20px 50px rgba(99,102,241,0.35)"
                            }}
                        >

                            <Typography
                                variant="h4"
                                fontWeight={700}
                            >
                                AI Assessment
                            </Typography>

                            <Typography
                                mt={3}
                                sx={{
                                    lineHeight: 2,
                                    fontSize: "1rem",
                                    opacity: .9
                                }}
                            >
                                Candidate demonstrated strong understanding
                                of backend development, Spring Boot,
                                Microservices and API design.

                                Communication was clear and structured.

                                Further improvement is recommended in
                                distributed systems,
                                fault tolerance,
                                scalability patterns
                                and production architecture discussions.
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={2}
                                mt={4}
                                flexWrap="wrap"
                            >
                                <Chip
                                    label="Microservices"
                                    color="success"
                                />

                                <Chip
                                    label="Communication"
                                    color="primary"
                                />

                                <Chip
                                    label="System Design"
                                    color="warning"
                                />

                                <Chip
                                    label="Architecture"
                                    color="error"
                                />
                            </Stack>

                        </Paper>

                    </Grid>

                </Grid>

                <Paper
                    elevation={4}
                    sx={{
                        p:4,
                        mt:4,
                        borderRadius:4,
                        background:
                            "linear-gradient(135deg,#020617,#1e1b4b,#312e81)",
                        color:"white"
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        AI Interview Summary
                    </Typography>

                    <Typography
                        mt={2}
                        sx={{
                            lineHeight:2
                        }}
                    >
                        Candidate demonstrated
                        understanding of core concepts,
                        but requires improvement in
                        distributed systems,
                        scalability,
                        fault tolerance and
                        production-grade architecture
                        discussions.
                    </Typography>
                </Paper>

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

                <Paper
                    elevation={4}
                    sx={{
                        p:4,
                        mt:4,
                        borderRadius:4
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >
                        Skill Breakdown
                    </Typography>

                    <Box mt={3}>
                        <Typography>
                            Communication
                        </Typography>

                        <LinearProgress
                            variant="determinate"
                            value={dashboard.averageScore * 10}
                            sx={{
                                height:10,
                                borderRadius:10,
                                mb:3
                            }}
                        />

                        <Typography>
                            Problem Solving
                        </Typography>

                        <LinearProgress
                            variant="determinate"
                            value={
                                dashboard.averageScore * 9
                            }
                            sx={{
                                height:10,
                                borderRadius:10,
                                mb:3
                            }}
                        />

                        <Typography>
                            Technical Depth
                        </Typography>

                        <LinearProgress
                            variant="determinate"
                            value={
                                dashboard.averageScore * 8
                            }
                            sx={{
                                height:10,
                                borderRadius:10
                            }}
                        />
                    </Box>
                </Paper>

                <Paper
                    elevation={4}
                    sx={{
                        p:4,
                        mt:4,
                        borderRadius:4
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >
                        Achievements
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={2}
                        mt={2}
                        flexWrap="wrap"
                    >
                        <Chip
                            icon={<EmojiEventsIcon />}
                            label="Interview Completed"
                            color="success"
                        />

                        <Chip
                            icon={<TrendingUpIcon />}
                            label="AI Evaluated"
                            color="primary"
                        />

                        <Chip
                            icon={<TimelineIcon />}
                            label="Performance Tracked"
                            color="secondary"
                        />
                    </Stack>
                </Paper>

                <Paper
                    elevation={4}
                    sx={{
                        p: 4,
                        mt: 4,
                        borderRadius: 4
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >
                        Interview Responses
                    </Typography>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Question
                                    </TableCell>

                                    <TableCell>
                                        Score
                                    </TableCell>

                                    <TableCell>
                                        Feedback
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>

                                {history.map((item,index)=>(
                                    <TableRow key={index}>

                                        <TableCell>
                                            {item.question}
                                        </TableCell>

                                        <TableCell>
                                            {item.score}/10
                                        </TableCell>

                                        <TableCell>
                                            {item.feedback}
                                        </TableCell>

                                    </TableRow>
                                ))}

                            </TableBody>
                        </Table>
                    </TableContainer>

                </Paper>

            </Paper>

            <Paper
                container
                elevation={4}
                sx={{
                    p: 4,
                    mt: 4,
                    borderRadius: 4
                }}
            >
                <Typography
                    variant="h5"
                    gutterBottom
                    fontWeight={700}
                >
                    Quick Actions
                </Typography>

                <Stack
                    direction="row"
                    spacing={2}
                    mt={2}
                    flexWrap="wrap"
                >
                    <Button
                        variant="contained"
                        startIcon={<DescriptionIcon />}
                        onClick={() =>
                            navigate(`/report/${sessionId}`)
                        }
                    >
                        View Detailed Report
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() =>
                            navigate(`/report/${sessionId}?download=true`)
                        }
                    >
                        Download Report
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<ReplayIcon />}
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Start New Interview
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}

export default Dashboard;