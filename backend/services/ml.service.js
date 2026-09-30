import axios from `axios`;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

export const getRecommendations = async (ingredients) => {
    const response = await axios.post(
        `${ML_SERVICE_URL}/recommend`,
        { ingredients }
    );

    return response.data;
}

export const getRecipe = async (name) => {
    const response = await axios.get(
        `${ML_SERVICE_URL}/recipe/${name}`
    );

    return response.data;
}

export const getSimilarRecipes = async (favoriteNames) => {
    const response = await axios.post(
        `${ML_SERVICE_URL}/similar`,
        { favorite_names: favoriteNames }
    );

    return response.data;
}

