import React, { useState } from "react";
import { generateDevnagriPassword } from "../utils/passwordGenerator";
import { savePasswordToDB, getPasswordFromDB } from "../utils/passwordUtils";
import { useNavigate } from "react-router-dom";
import { convertToDevnagri } from "../utils/devnagriEncoder";

const DevanagriPasswordSuggester = () => {
    const [passwords, setPasswords] = useState([]);
    const [selectedPassword, setSelectedPassword] = useState("");
    const [retrievedPassword, setRetrievedPassword] = useState("");  // 🔥 New: Store retrieved password
    const navigate = useNavigate();

    // Generate password suggestions
    const handleSuggestPasswords = () => {
        const generatedPasswords = Array.from({ length: 5 }, generateDevnagriPassword);
        setPasswords(generatedPasswords);
    };

    // Save selected password securely
    const handleSavePassword = async () => {
        if (!selectedPassword) {
            alert("Please select a password!");
            return;
        }

        try {
            await savePasswordToDB(selectedPassword);
            alert("✅ Password securely stored in the database!");
        } catch (error) {
            console.error("Error saving password:", error);
            alert("❌ Failed to save password!");
        }
    };

    // Retrieve password from database
    const handleRetrievePassword = async () => {
        try {
            const storedPassword = await getPasswordFromDB("testUser"); // Ensure you're passing the correct userId
            if (storedPassword) {
                setRetrievedPassword(storedPassword);
            } else {
                alert("❌ No saved password found!");
            }
        } catch (error) {
            console.error("Error retrieving password:", error);
            alert("❌ Failed to retrieve password!");
        }
    };

    return (
        <div className="p-4 border rounded shadow-lg text-center">
            <h2 className="text-xl font-bold mb-2">🔐 Devnagri-Style Password Suggester</h2>
            <button onClick={handleSuggestPasswords} className="bg-blue-500 text-white px-4 py-2 rounded mb-2">
                Generate Secure Passwords
            </button>

            {passwords.length > 0 && (
                <div className="mt-2">
                    {passwords.map((pwd, index) => (
                        <div key={index} className="flex justify-between items-center border p-2 mt-2">
                            <span>{pwd} → {convertToDevnagri(pwd)}</span>
                            <button 
                                onClick={() => setSelectedPassword(pwd)} 
                                className="bg-green-500 text-white px-2 py-1 rounded">
                                Select
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {selectedPassword && (
                <div className="mt-4">
                    <p className="font-semibold">Selected Password: {selectedPassword}</p>
                    <button onClick={handleSavePassword} className="bg-purple-500 text-white px-4 py-2 rounded mt-2">
                        Save Securely
                    </button>
                    <button onClick={() => navigate("/store")} className="bg-purple-500 text-white px-4 py-2 rounded mt-2">
                        Verify
                    </button>
                </div>
            )}

            {/* 🔥 New: Retrieve & Display Password Section */}
            <div className="mt-4">
                <button onClick={handleRetrievePassword} className="bg-yellow-500 text-white px-4 py-2 rounded mt-2">
                    Retrieve Saved Password
                </button>

                {retrievedPassword && (
                    <p className="font-semibold mt-2">🔓 Retrieved Password: {retrievedPassword}</p>
                )}
            </div>
        </div>
    );
};

export default DevanagriPasswordSuggester;
