import { BrowserRouter, Routes, Route } from "react-router-dom";

import UploadResume from "./pages/UploadResume";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import InterviewRoom from "./pages/InterviewRoom";
import Dashboard from "./pages/Dashboard.jsx";
import FinalReport from "./pages/FinalReport";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UploadResume />} />

          <Route
              path="/analysis/:resumeId"
              element={<ResumeAnalysis />}
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
        </Routes>
      </BrowserRouter>
  );
}

export default App;