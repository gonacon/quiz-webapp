import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import QuizPage from "pages/QuizPage";
import CreateQuestion from "pages/CreateQuestion";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/quiz" />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/create" element={<CreateQuestion />} />
                {/* 다른 페이지를 만들고 싶으면 여기에 Route 추가 */}
            </Routes>
        </Router>
    );
}

export default App;