import { BrowserRouter, Routes, Route } from "react-router-dom";

import UploadResume from "./pages/UploadResume";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import InterviewRoom from "./pages/InterviewRoom";
import Dashboard from "./pages/Dashboard.jsx";
import FinalReport from "./pages/FinalReport";
import LoadingScreen from "./components/LoadingScreen.jsx";
import InterviewSetup from "./pages/InterviewSetup.jsx";
import InterviewHistory from "./pages/InterviewHistory.jsx";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route
              path="/"
              element={<UploadResume
              />}
          />

            <Route
                path="/loading"
                element={<LoadingScreen />}
            />

          <Route
              path="/analysis/:resumeId"
              element={<ResumeAnalysis />}
          />

            <Route
                path="/setup/:sessionId"
                element={<InterviewSetup />}
            />

          <Route
              path="/interview/:sessionId"
              element={<InterviewRoom />}
          />

          <Route
              path="/dashboard/:sessionId"
              element={<Dashboard />}
          />

          <Route
              path="/report/:sessionId"
              element={<FinalReport />}
          />
            <Route
                path="/history/:sessionId"
                element={<InterviewHistory />}
            />
        </Routes>
      </BrowserRouter>
  );
}

export default App;