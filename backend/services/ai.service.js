
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({apiKey : "AIzaSyD2qK4oUixZNJaL_FMFzO031xLtGodsHvM"});
export async function generatePlan({ days, protein, carbs, allergies }) {

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

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    const text = response.candidates[0].content.parts[0].text;
    const cleaned = text.replace(/\*/g, "");
    // console.log(text);
    return cleaned;
}