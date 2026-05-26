import { getRecommendations, getRecipe, getSimilarRecipes as fetchSimilarRecipes } from "../services/ml.service.js";
import { addFavoriteRecipe, getFavoriteRecipes, removeFavoriteRecipe } from "../services/auth.service.js";

// export const recommendRecipes = async (req, res) => {
//     try {
//         const { pantry, maxMissing, cuisine, mealTypes } = req.body;
        
//         const ingredients = pantry.join(",");

//         let recipes = await getRecommendations(ingredients);

//         if (maxMissing !== null) {
//             recipes = recipes.filter(r =>
//                 Number(r.ExtraIngredientsCount) <= maxMissing
//             );
//         }

//         if (cuisine && cuisine !== "Any Cuisine") {
//             recipes = recipes.filter(r =>
//                 r.Cuisine?.toLowerCase() === cuisine.toLowerCase()
//             );
//         }

//         if (mealTypes && mealTypes.length > 0) {
//             recipes = recipes.filter(r =>
//                 mealTypes.includes(r.Course)
//             );
//         }

//         // const validRecipes = [];

//         // for (let recipe of recipes) {
//         //     try {
//         //         const fullRecipe = await getRecipe(recipe.TranslatedRecipeName);

//         //         if (fullRecipe && fullRecipe.CleanedIngredients) {
//         //             validRecipes.push(recipe);
//         //         }
//         //     } catch (err) {
//         //         console.log("Skipping bad recipe:", recipe.TranslatedRecipeName);
//         //     }
//         // }

//         res.render("recommend", { recipes, query: pantry.join(", ") });

//     } catch (error) {
//         res.status(500).json({ message: "Error generating recipes" });
//     }
// };

export const recommendRecipes = async (req, res) => {
    try {
        const { pantry, maxMissing, cuisine, mealTypes } = req.body;

        if (!pantry || !Array.isArray(pantry)) {
            throw new Error("Pantry is missing or not an array");
        }

        const ingredients = pantry.join(",");

        let recipes;
        try {
            recipes = await getRecommendations(ingredients);
        } catch (err) {
            return res.status(500).json({ error: "Failed to fetch recommendations" });
        }

        if (!recipes || !Array.isArray(recipes)) {
            return res.status(500).json({ error: "Invalid recommendations data format" });
        }

        try {
            if (maxMissing !== null) {
                recipes = recipes.filter(r =>
                    Number(r.ExtraIngredientsCount) <= maxMissing
                );
            }

            if (cuisine && cuisine !== "Any Cuisine") {
                recipes = recipes.filter(r =>
                    r.Cuisine?.toLowerCase() === cuisine.toLowerCase()
                );
            }

            if (mealTypes && mealTypes.length > 0) {
                recipes = recipes.filter(r =>
                    mealTypes.includes(r.Course)
                );
            }

        } catch (err) {
            return res.status(500).json({ error: "Error while filtering recipes" });
        }

        const validRecipes = [];
        const failedRecipes = [];

        for (let recipe of recipes) {
            try {
                const fullRecipe = await getRecipe(recipe.TranslatedRecipeName);

                if (!fullRecipe) {
                    throw new Error("Empty recipe response");
                }

                if (!fullRecipe.CleanedIngredients) {
                    throw new Error("Missing ingredients");
                }

                validRecipes.push(recipe);

            } catch (err) {
                console.error("ERROR in getRecipe:", {
                    name: recipe.TranslatedRecipeName,
                    error: err.message
                });

                failedRecipes.push({
                    name: recipe.TranslatedRecipeName,
                    reason: err.message
                });
            }
        }


        return res.render("recommend", {
            recipes: validRecipes,
            query: pantry.join(", ")
        });

    } catch (error) {
        console.error("FINAL ERROR:", error);
        return res.status(500).json({
            error: "Unexpected server error",
            details: error.message
        });
    }
};

export const favoriteRecipe = async (req, res) => {
    try {
        const { email, recipe } = req.body;

        if (!email || !recipe || !recipe.TranslatedRecipeName) {
            return res.status(400).json({ message: "Missing favorite recipe data" });
        }

        await addFavoriteRecipe(email, {
            name: recipe.TranslatedRecipeName,
            imageURL: recipe.ImageURL,
            cuisine: recipe.Cuisine,
            diet: recipe.Diet,
            missingCount: recipe.ExtraIngredientsCount,
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: "Error saving favorite" });
    }
};

export const getFavorites = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "Missing email" });
        }

        const favorites = await getFavoriteRecipes(email);
        res.json({ favorites });
    } catch (error) {
        res.status(500).json({ message: "Error fetching favorites" });
    }
};

export const getSimilarRecipes = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "Missing email" });
        }

        const favorites = await getFavoriteRecipes(email);
        const favoriteNames = favorites.map(f => f.name);

        if (favoriteNames.length === 0) {
            return res.json({ similar: [] });
        }

        const similar = await fetchSimilarRecipes(favoriteNames);
        res.json({ similar });
    } catch (error) {
        res.status(500).json({ message: "Error fetching similar recipes" });
    }
};

export const removeFavoriteRecipeHandler = async (req, res) => {
    try {
        const { email, recipeName } = req.body;

        if (!email || !recipeName) {
            return res.status(400).json({ message: "Missing email or recipeName" });
        }

        await removeFavoriteRecipe(email, recipeName);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: "Error removing favorite" });
    }
};

// export const recipeDetail = async (req, res) => {
//     try {
//         const recipe = await getRecipe(req.params.name);
        
//         if (typeof recipe.RecipeSteps === "string"){
//             recipe.RecipeSteps = JSON.parse(recipe.RecipeSteps.replace(/'/g, '"') );
//         }
//         res.render("dish_detail", { recipe });
//     } catch (err) {
//         res.status(500).send("Error fetching recipe");
//     }
// };

export const recipeDetail = async (req, res) => {
    try {
        const recipe = await getRecipe(req.params.name);

        try {
            if (typeof recipe.RecipeSteps === "string") {
                const cleaned = recipe.RecipeSteps
                    .replace(/'/g, '"')   
                    .replace(/\n/g, " "); 

                recipe.RecipeSteps = JSON.parse(cleaned);
            }

            if (!Array.isArray(recipe.RecipeSteps)) {
                throw new Error("Not an array");
            }

        } catch (parseError) {
            console.warn("⚠️ RecipeSteps parse failed:", req.params.name);
            recipe.RecipeSteps = recipe.RecipeSteps
                ? recipe.RecipeSteps.split(".").map(s => s.trim()).filter(Boolean)
                : ["Steps not available"];
        }

        res.render("dish_detail", { recipe });

    } catch (err) {
        console.error("❌ Recipe detail error:", err.message);
        return res.redirect("/search.html");
    }
};
