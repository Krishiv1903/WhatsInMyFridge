import axios from "axios";

const getMLServiceUrl = () => {
    const serviceUrl = process.env.ML_SERVICE_URL?.trim().replace(/\/+$/, "");
    if (!serviceUrl) {
        throw new Error("ML_SERVICE_URL is required to contact the recipe service");
    }
    return serviceUrl;
};

export const getRecommendations = async (ingredients) => {
    const response = await axios.post(
        `${getMLServiceUrl()}/recommend`,
        { ingredients }
    );

    return response.data;
}

export const getRecipe = async (name) => {
    const response = await axios.get(
        `${getMLServiceUrl()}/recipe/${encodeURIComponent(name)}`
    );

    return response.data;
}

export const getSimilarRecipes = async (favoriteNames) => {
    const response = await axios.post(
        `${getMLServiceUrl()}/similar`,
        { favorite_names: favoriteNames }
    );

    return response.data;
}
