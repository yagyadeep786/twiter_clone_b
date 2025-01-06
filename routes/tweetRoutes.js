import express from "express";
import isAuthenticated from "../config/auth.js";
import { CreateTweet, DeleteTweet, GetAllTweets, GetFollowingTweet, LikeOrDislike } from "../controllers/tweetController.js";
const route= express.Router();

route.post("/create",isAuthenticated,CreateTweet);
route.delete("/delete/:id",isAuthenticated,DeleteTweet)
route.put("/like/:id",isAuthenticated,LikeOrDislike)
route.get("/alltweets/:id",isAuthenticated,GetAllTweets);
route.get("/followingtweets/:id",isAuthenticated,GetFollowingTweet);


export default route;