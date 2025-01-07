import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import Userrouter from "./routes/userRoutes.js";
import dbConnection from "./config/dbConfig.js";
import tweetRoute from "./routes/tweetRoutes.js"
import cors from "cors";

dotenv.config();
var app= express();

dbConnection();
//middleware
app.use(cors({
    origin:"https://twiter-clone-woad.vercel.app/",
    credentials:true,
}))

app.use(express.urlencoded({
    extended:true
}))
app.use(express.json());
app.use(cookieParser());

//apis
app.use("/api/user",Userrouter);
app.use("/api/tweet",tweetRoute);

app.get("*",(req,res)=>{
    res.status(404).json("file is not exits");
})

app.listen(process.env.PORT,()=>{
    console.log("server is listening on port 5000");
})