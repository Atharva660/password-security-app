import React, { useState } from "react";
import { calculatePasswordStrength, checkPasswordLeak } from "../utils/passwordStrength"; 
import { useNavigate } from "react-router-dom";  // ✅ Import useNavigate



const PasswordStrengthChecker = () => {
    const [password, setPassword] = useState("");
    const [result, setResult] = useState(null);
    const [leakResult, setLeakResult] = useState("");
    const navigate = useNavigate();  // ✅ Initialize navigate


    const analyzePassword = async () => {
        if (!password) {
            setResult({ strength: "N/A", message: "Please enter a password!" });
            setLeakResult("");
            return;
        }

        const strengthResult = calculatePasswordStrength(password);
        setResult(strengthResult);

        try {
            const leakCheck = await checkPasswordLeak(password);
            setLeakResult(leakCheck);
        } catch (error) {
            setLeakResult("⚠️ Error checking password leak database.");
        }
    };
    const handleSubmit = () => {
        navigate("/password-suggester");  // 🔥 Change this to your desired route
    };
    return (
        <div className="p-4 border rounded shadow-lg text-center">
            <h2 className="text-xl font-bold mb-2">🔍 Advanced Password Strength Checker</h2>
            <input
                type="password"
                className="border p-2 rounded mb-2"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={analyzePassword} className="bg-blue-500 text-white px-4 py-2 rounded">
                Analyze Password
            </button>

            {result && (
                <div className="mt-2">
                    <p className="text-lg font-semibold">Strength: {result.strength}</p>
                    <p className="text-sm">💡 {result.message}</p>
                    <p className="text-red-500 mt-2">{leakResult}</p>
                </div>
            )}
            <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded mt-4">
                Submit
            </button>
        </div>
    );
};

export default PasswordStrengthChecker;
