import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const saveUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({ ...userData,
        password: hashedPassword,
        createdAt: new Date() });
    delete user._doc.confirmPassword;
    await user.save();
};

export const validateUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) return false;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
};

export const addFavoriteRecipe = async (email, recipeData) => {
    const user = await User.findOneAndUpdate(
        { email },
        {
            $addToSet: {
                favorites: recipeData,
            },
        },
        { new: true, upsert: false }
    );
    return user;
};

export const removeFavoriteRecipe = async (email, recipeName) => {
    const user = await User.findOneAndUpdate(
        { email },
        {
            $pull: {
                favorites: { name: recipeName },
            },
        },
        { new: true }
    );
    return user;
};

export const getFavoriteRecipes = async (email) => {
    const user = await User.findOne({ email });
    return user?.favorites || [];
};

export const emailExists = async (email) => {
    const user = await User.findOne({ email });
    console.log("Checking if email exists:", email, "Found user:", user);
    return !!user;
};