import { generatePlan } from "../services/ai.service.js";

export const generateMealPlan = async (req, res) => {
    try {
        const { days, protein, carbs, allergies } = req.body;

        const result = await generatePlan({ days, protein, carbs, allergies });

        res.json({ plan: result });

    } catch (err) {
        console.error(err);
        res.status(500).json({ plan: "Error generating plan" });
    }
};