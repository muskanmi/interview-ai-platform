import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    Box,
    Typography,
    Paper,
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

        const response =
            await interviewApi.get(
                `/api/interviews/${sessionId}/final-report`
            );

        setReport(response.data);
    };

    if (!report)
        return <div>Loading...</div>;

    return (
        <Box p={5}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h3">
                    Interview Report
                </Typography>

                <pre>
                    {JSON.stringify(
                        report,
                        null,
                        2
                    )}
                </pre>
            </Paper>
        </Box>
    );
}

export default FinalReport;