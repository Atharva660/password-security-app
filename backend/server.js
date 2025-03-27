import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./firebase.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Sample API Route
app.get("/", (req, res) => {
    res.send("Backend Server is Running 🚀");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
