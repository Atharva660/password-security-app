import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import PasswordStrengthChecker from "./component/PasswordStrengthChecker";
import DevanagriPasswordSuggester from "./component/DevanagriPasswordSuggester";
import Landing from "./component/landing";

function App() {
    return (
        <Router>
            <div>  
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/password-strength" element={<PasswordStrengthChecker />} />
                    <Route path="/password-suggester" element={<DevanagriPasswordSuggester />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
