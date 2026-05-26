import express from "express";
import dotenv from "dotenv";
import authRoutes from "../routes/auth.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import searchRoutes from "../routes/search.routes.js";
import aiRoutes from "../routes/ai.routes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "../public"))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/signUp.html"));
});

export default app;
