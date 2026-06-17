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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useLocation } from "react-router-dom";

function FinalReport() {

    const { sessionId } = useParams();
    const location = useLocation();

    const [report, setReport] =
        useState(null);

    useEffect(() => {

        loadReport();

    }, []);

    const generatePdf = async () => {

        const element =
            document.getElementById(
                "report-content"
            );

        if (!element) return;

        const canvas =
            await html2canvas(
                element,
                {
                    scale: 3,
                    useCORS: true,
                    logging: false,
                    scrollY: -window.scrollY,
                    windowWidth: element.scrollWidth,
                    windowHeight: element.scrollHeight
                }
            );

        const imgData =
            canvas.toDataURL(
                "image/png"
            );

        const pdf =
            new jsPDF(
                "p",
                "mm",
                "a4"
            );

        const pdfWidth =
            pdf.internal.pageSize.getWidth();

        const pdfHeight =
            pdf.internal.pageSize.getHeight();

        const imgWidth =
            pdfWidth;

        const imgHeight =
            (canvas.height * imgWidth)
            / canvas.width;

        let heightLeft =
            imgHeight;

        let position = 0;

        pdf.addImage(
            imgData,
            "PNG",
            0,
            position,
            imgWidth,
            imgHeight
        );

        heightLeft -= pdfHeight;

        while (
            heightLeft > 0
            ) {

            position =
                heightLeft -
                imgHeight;

            pdf.addPage();

            pdf.addImage(
                imgData,
                "PNG",
                0,
                position,
                imgWidth,
                imgHeight
            );

            heightLeft -=
                pdfHeight;
        }

        pdf.save(
            "Interview_Report.pdf"
        );
    };

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

    const searchParams =
        new URLSearchParams(location.search);

    const shouldDownload =
        searchParams.get("download");

    useEffect(() => {

        if (
            report &&
            shouldDownload === "true"
        ) {

            setTimeout(() => {
                requestAnimationFrame(() => {
                    generatePdf();
                });
            }, 1500);

        }

    }, [report]);

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
                id="report-content"
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

                            <Box
                                sx={{
                                    mt: 2,
                                    width: 70,
                                    height: 70,
                                    borderRadius: "50%",
                                    bgcolor: "#1976d2",
                                    color: "white",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    mx: "auto"
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    color="white"
                                >
                                    {report.averageScore ?? "N/A"}
                                </Typography>
                            </Box>
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

                            <Box
                                sx={{
                                    mt: 2,
                                    bgcolor:
                                        report.averageScore >= 8
                                            ? "#2e7d32"
                                            : report.averageScore >= 6
                                                ? "#ed6c02"
                                                : "#d32f2f",
                                    color: "white",
                                    px: 3,
                                    py: 1,
                                    borderRadius: 10,
                                    display: "inline-block",
                                    fontWeight: 700
                                }}
                            >
                                {report.averageScore >= 8
                                    ? "Excellent"
                                    : report.averageScore >= 6
                                        ? "Good"
                                        : "Needs Improvement"}
                            </Box>
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

                            <Box
                                sx={{
                                    mt: 2,
                                    bgcolor: "#2e7d32",
                                    color: "white",
                                    px: 3,
                                    py: 1,
                                    borderRadius: 10,
                                    display: "inline-block",
                                    fontWeight: 700
                                }}
                            >
                                Completed
                            </Box>
                        </Paper>
                    </Grid>

                </Grid>

                <Paper
                    sx={{
                        p: 4,
                        mb: 4,
                        bgcolor: "#f8fafc",
                        pageBreakInside: "avoid"
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
                        bgcolor: "#fff7ed",
                        overflowWrap: "break-word",
                        wordBreak: "break-word"
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
                        bgcolor: "#ecfeff",
                        overflowWrap: "break-word",
                        wordBreak: "break-word"
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