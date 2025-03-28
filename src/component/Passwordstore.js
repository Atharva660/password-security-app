import React, { useState } from "react";
import crypto from "crypto";
import { db, doc, setDoc } from "../firebase";

const PasswordStore = () => {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const hashPassword = (password) => {
        const salt = crypto.randomBytes(64).toString("hex");
        const hash = crypto.pbkdf2Sync(password, salt, 200000, 64, "sha512").toString("hex");
        return { salt, hash };
    };

    const handleStore = async () => {
        if (!userId || !password) {
            setMessage("⚠️ Please enter both User ID and Password.");
            return;
        }

        const { salt, hash } = hashPassword(password);

        try {
            await setDoc(doc(db, "users", userId), { salt, hash });
            setMessage("✅ Password Stored Successfully!");
        } catch (error) {
            setMessage("⚠️ Error storing password.");
        }
    };

    return (
        <div className="p-4 border rounded shadow-lg text-center">
            <h2 className="text-xl font-bold mb-2">🔒 Store Password</h2>
            <input
                type="text"
                className="border p-2 rounded mb-2 w-full"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <input
                type="password"
                className="border p-2 rounded mb-2 w-full"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleStore} className="bg-green-500 text-white px-4 py-2 rounded w-full">
                Store Password
            </button>
            {message && <p className="mt-2">{message}</p>}
        </div>
    );
};

export default PasswordStore;
