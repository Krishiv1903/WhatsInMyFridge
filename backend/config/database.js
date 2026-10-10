import mongoose from "mongoose";

export const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("MONGODB_URI is required to connect to MongoDB Atlas");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected");
};
