import axios from "axios";

export const getRecommendations = async (ingredients) => {
    const response = await axios.post(
        "http://localhost:5001/recommend",
        { ingredients }
    );

    return response.data;
}

export const getRecipe = async (name) => {
    const response = await axios.get(
        `http://localhost:5001/recipe/${name}`
    );

    return response.data;
}

export const getSimilarRecipes = async (favoriteNames) => {
    const response = await axios.post(
        "http://localhost:5001/similar",
        { favorite_names: favoriteNames }
    );

    return response.data;
}

