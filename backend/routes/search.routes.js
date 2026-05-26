import express from "express";
import {
    recipeDetail,
    recommendRecipes,
    favoriteRecipe,
    getFavorites,
    getSimilarRecipes,
    removeFavoriteRecipeHandler,
} from "../controllers/search.controller.js";

const router = express.Router();

router.post("/generate", recommendRecipes);
router.post("/favorite", favoriteRecipe);
router.delete("/favorite", removeFavoriteRecipeHandler);
router.get("/favorites", getFavorites);
router.get("/similar", getSimilarRecipes);
router.get("/recipe/:name", recipeDetail);

export default router;
