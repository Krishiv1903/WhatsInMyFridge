
import { GoogleGenAI } from "@google/genai";

export async function generatePlan({ days, protein, carbs, allergies }) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is required to generate meal plans");
    }

    const prompt = `
    Create a ${days}-day meal plan.

    Requirements:
    - Protein target: ${protein}g
    - Carbs target: ${carbs}g
    - Avoid: ${allergies}

    Include:
    Breakfast, Lunch, Dinner.
    Keep it simple and clean.
    `;

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
    });
    const text = response.text;
    if (!text) {
        throw new Error("Gemini returned an empty meal plan");
    }
    const cleaned = text.replace(/\*/g, "");
    return cleaned;
}
