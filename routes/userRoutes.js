import express from "express";
import { Register,Login, BookMark,Logout, Profile, GetOtherUser, Follow, UnFollow } from "../controllers/userController.js";
import isAuthenticated from "../config/auth.js";
const router= express.Router();

router.post("/register",Register);
router.post("/login",Login);
router.post("/bookmark/:id",BookMark);
router.get("/logout",Logout);
router.get("/profile/:id",isAuthenticated,Profile)
router.get("/otheruser/:id",isAuthenticated,GetOtherUser)
router.post("/follow/:id",isAuthenticated,Follow);
router.post("/unfollow/:id",isAuthenticated,UnFollow);

export default router;