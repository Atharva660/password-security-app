import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import PasswordStrengthChecker from "./component/PasswordStrengthChecker";
import DevanagriPasswordSuggester from "./component/DevanagriPasswordSuggester";

function App() {
    return (
        <Router>
            <div>  
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/password-strength" element={<PasswordStrengthChecker />} />
                    <Route path="/password-suggester" element={<DevanagriPasswordSuggester />} />
                    <Route path="/store" element={<PasswordStore />} />
                    <Route path="/verify" element={<PasswordVerify />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
