import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import PasswordStrengthChecker from "./component/PasswordStrengthChecker";
import DevanagriPasswordSuggester from "./component/DevanagriPasswordSuggester";
import PasswordStore from "./component/Passwordstore";
import PasswordVerify from "./component/passwordverify";

function App() {
    return (
        <Router>
            <div>  
                <Routes>
                    <Route path="/" element={<Login />} />
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
