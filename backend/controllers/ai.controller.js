import { generatePlan } from "../services/ai.service.js";

export const generateMealPlan = async (req, res) => {
    try {
        const { days, protein, carbs, allergies } = req.body;

        const result = await generatePlan({ days, protein, carbs, allergies });

        res.json({ plan: result });

    } catch (err) {
        console.error(err);
        const status = err.message === "GEMINI_API_KEY is required to generate meal plans" ? 503 : 500;
        res.status(status).json({ error: "Error generating meal plan" });
    }
};