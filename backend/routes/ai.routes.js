import express from "express";
import { generateMealPlan } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/meal-plan", generateMealPlan);

export default router;