import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGODB_URL = process.env.MONGODB_URL;

const dbConnection = () => {
    if (!MONGODB_URL) {
        console.error("MONGODB_URL is not defined. Please set it in your environment variables.");
        return; // Exit the function if the URL is not defined
    }
    
    mongoose.connect(MONGODB_URL).then(() => {
        console.log("Mongodb connected successfully");
    }).catch((err) => {
        console.log(err);
    });
}

export default dbConnection;