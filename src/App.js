import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import Landing from "./component/landing";
import PasswordStrengthChecker from "./component/PasswordStrengthChecker";
import DevanagriPasswordSuggester from "./component/DevanagriPasswordSuggester";
import PasswordManagerScreen from "./component/PasswordManagerScreen";
 import BiometricAuth from './component/BiometricAuth';
 import './component/EarthModel.js';
 import SecurityEducation from "./component/securityedu.js";


function App() {
    return (
        <Router>
            <div>  
                <Routes>
                <Route path="/" element={<Login />} />
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/password-strength" element={<PasswordStrengthChecker />} />
                    <Route path="/password-suggester" element={<DevanagriPasswordSuggester />} />
                    <Route path="/password-manager" element={<BiometricAuth />} />
                    <Route path="/security-education" element={<SecurityEducation/>}/>
                    {<Route path="/password-manager/main"  element={<PasswordManagerScreen/>}/> }
                </Routes>
            </div>
        </Router>
    );
}

export default App;
