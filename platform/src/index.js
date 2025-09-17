import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import webhookRoutes from "./routes/webhook.js";
import apiRoutes from "./routes/api.js";

dotenv.config();
const app = express();

// IMPORTANT: mount webhook route BEFORE the JSON body parser
app.use("/webhook", webhookRoutes);

// general middlewares
app.use(cors());
app.use(express.json()); // for normal JSON API routes

app.use("/api", apiRoutes);

// static public files
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});