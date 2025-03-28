import React, { useState } from "react";
import crypto from "crypto";
import { db, doc, getDoc } from "../firebase";

const PasswordVerify = () => {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const verifyPassword = async () => {
        if (!userId || !password) {
            setMessage("⚠️ Please enter both User ID and Password.");
            return;
        }

        const userDoc = await getDoc(doc(db, "users", userId));

        if (!userDoc.exists()) {
            setMessage("❌ User not found!");
            return;
        }

        const { salt, hash: storedHash } = userDoc.data();
        const enteredHash = crypto.pbkdf2Sync(password, salt, 200000, 64, "sha512").toString("hex");

        if (enteredHash === storedHash) {
            setMessage("✅ Login Successful!");
        } else {
            setMessage("❌ Incorrect Password!");
        }
    };

    return (
        <div className="p-4 border rounded shadow-lg text-center">
            <h2 className="text-xl font-bold mb-2">🔐 Verify Password</h2>
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
            <button onClick={verifyPassword} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                Verify Password
            </button>
            {message && <p className="mt-2">{message}</p>}
        </div>
    );
};

export default PasswordVerify;
