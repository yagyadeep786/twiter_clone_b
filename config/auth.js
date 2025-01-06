import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();
const isAuthenticated = async(req,res,next)=>{
    try {
        const token = req.cookies.token;
        console.log("cookies", req.cookies.token);
        if(!token){
        return res.status(401).json({
            message:"Token not found",
            success:false,
        })
        }
        const varify= jwt.verify(token,process.env.TOKEN_SECRECT);
        if(!varify){
            return res.redirect("/login");
        }
        req.userId= varify.userId;
        next();
    } catch (error) {
        return res.status(401).json({
            message:error.message,
            success:false,
        })
    }
}

export default isAuthenticated;