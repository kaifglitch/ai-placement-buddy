import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AssessmentSelect from "./pages/AssessmentSelect";
import AssessmentAttempt from "./pages/AssessmentAttempt";
import AssessmentResult from "./pages/AssessmentResult";
import InterviewSelect from "./pages/InterviewSelect";
import InterviewAttempt from "./pages/InterviewAttempt";
import InterviewResult from "./pages/InterviewResult";
import CodingSelect from "./pages/CodingSelect";
import CodingPlayground from "./pages/CodingPlayground";
import CareerAssistant from "./pages/CareerAssistant";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/assessment/select" element={<ProtectedRoute><AssessmentSelect /></ProtectedRoute>} />
        <Route path="/assessment/attempt" element={<ProtectedRoute><AssessmentAttempt /></ProtectedRoute>} />
        <Route path="/assessment/result" element={<ProtectedRoute><AssessmentResult /></ProtectedRoute>} />
        <Route path="/interview/select" element={<ProtectedRoute><InterviewSelect /></ProtectedRoute>} />
        <Route path="/interview/attempt" element={<ProtectedRoute><InterviewAttempt /></ProtectedRoute>} />
        <Route path="/interview/result" element={<ProtectedRoute><InterviewResult /></ProtectedRoute>} />
        <Route path="/coding/select" element={<ProtectedRoute><CodingSelect /></ProtectedRoute>} />
        <Route path="/coding/playground" element={<ProtectedRoute><CodingPlayground /></ProtectedRoute>} />
        <Route path="/career" element={<ProtectedRoute><CareerAssistant /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
