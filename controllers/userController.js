import User from "../models/userSchema.js";
import Tweet from "../models/tweetSchema.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const Register= async (req,res)=>{

    try {
        
        const {username,email,password,confirmpassword}= req.body;
        if(!username || !email || !password || !confirmpassword){
           return res.status(400).json({
                msg:"Fields are required",
                success:false
            })
        }

        if(password != confirmpassword){
            return res.status(400).json({
                msg:"Pasword is not match",
                success:false
            })
        }

        const result= await User.findOne({email});
        if(result){
            return res.status(400).json({
                msg:"User alrady exits",
                success:false
            })
        }
        const incript= await bcrypt.hash(password,16);
        console.log("incrypt password: ",incript);

        const status= await User.create({
            username:username,
            password:incript,
            email:email
        })

        return res.status(200).json({
            msg:"User Registerd succesfully",
            userData:status,
            success:true
        })
    } catch (error) {
        return res.status(400).json({
            msg:error.message,
            success:false
        })
    }
}

const Login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                msg:"fields are requireds",
                success:false
            })
        }

        //compaire password
        const status= await User.findOne({email});
        if(!status){
            return res.status(400).json({
                msg:"username or password are incorrect",
                success:false
            })
        }
        const compaireStatus= bcrypt.compare(password,status.password);

        if(!compaireStatus){
            return res.status(400).json({
                msg:"username or password are incorrect",
                success:false
            })
        }
        const token = jwt.sign({ userId: status._id }, process.env.TOKEN_SECRECT, { expiresIn: "2h" });
        return res.status(200).cookie("token", token,{
            httpOnly:true,
            sameSite:none,
            
        }).json({
            msg: "welcome back " + status.username,
            userData: status,
            success: true
        })
    } catch (error) {
           return  res.status(400).json({
                msg:error.message,
                success:false
            })
    }
}

const Logout = (req,res)=>{
    return res.cookie("token","",{expiresIn:new Date(Date.now())}).json({
        message:"user logout succefully",
        success:true
    })
}

const BookMark = async(req,res)=>{
    try {
        const tweetId= req.params.id;
        const userId= req.body.userid;
        if(!tweetId){
            return res.status(400).json({
                msg:"id is not exits",
                success:false
            })
        }
        
        const user= await User.findById(userId);
        const tweet= await Tweet.findById(tweetId);

        if(user.bookmark.includes(tweet)){
            // remove
            await User.findByIdAndUpdate(userId,{$pull:{bookmark:tweet}});
            await Tweet.findByIdAndUpdate(tweetId,{$pull:{bookmarks:userId}})
            return  res.status(200).json({
                msg:"remove form bookmark",
                success:true
            })
        }else{
            //add 
            await User.findByIdAndUpdate(userId,{$push:{bookmark:tweet}});
            await Tweet.findByIdAndUpdate(tweetId,{$push:{bookmarks:userId}})
            return  res.status(200).json({
                msg:"bookmark succefully",
                success:true
            })
        }

    } catch (error) {
        res.status(400).json({
            msg:error.message,
            success:false
        })
    }
}


const Follow = async(req,res)=>{
    try {
        const logedinUserId= req.body.userId;
        const otherUserId= req.params.id;
        // check the user is alrady exit or not
        const user= await User.findById(logedinUserId);
        if(user.followings.includes(otherUserId)){
            return  res.status(200).json({
                msg:"User Alrady Follow",
                success:true
            })
        }else{
            //add
            await User.findByIdAndUpdate(logedinUserId,{$push:{followings:otherUserId}});
            await User.findByIdAndUpdate(otherUserId,{$push:{followers:logedinUserId}});
            return  res.status(200).json({
                msg:"follow Succefully",
                success:true
            })
        }
    } catch (error) {
        res.status(400).json({
            msg:error.message,
            success:false
        })
    }
}

const UnFollow = async(req,res)=>{
    try {
        const logedinUserId= req.body.userId;
        const otherUserId= req.params.id;

        // check the user is alrady exit or not
        const user= await User.findById(logedinUserId);
        if(user.followings.includes(otherUserId)){
            //remove
            await User.findByIdAndUpdate(logedinUserId,{$pull:{followings:otherUserId}});
            await User.findByIdAndUpdate(otherUserId,{$pull:{followers:logedinUserId}});
            return  res.status(200).json({
                msg:"Unfollow Succefully",
                success:true
            })
        }else{
            return  res.status(200).json({
                msg:"First Follow",
                success:true
            })
        }
    } catch (error) {
        return res.status(400).json({
            msg:error.message,
            success:false
        })
    }
}

const Profile= async (req,res)=>{
   try {
    const userId= req.params.id;
    const user= await User.findById(userId).select("-password");
    return res.status(200).json({
        msg:"loadprofile Succefully",
        userData:user,
        success:true
    })
   } catch (error) {
    return res.status(400).json({
        msg:error.message,
        success:false
    })
   }
}

const GetOtherUser= async (req,res)=>{
    try {
        const userId= req.params.id;
        const otherusers= await User.find({_id: {$ne: userId}}).select("-password");
        console.log(otherusers);
        if(!otherusers || otherusers.length === 0){
            return res.status(404).json({
                msg:"users not found",
                success:false
            })
        }
        return res.status(200).json({
            msg:"loadprofile Succefully",
            otherUsers:otherusers,
            success:true
        })
    } catch (error) {
        return res.status(400).json({
            msg:error.message,
            success:false
        })
    }

}
export {
    Register,
    Login,
    BookMark,
    Follow,
    Logout,
    Profile,
    GetOtherUser,
    UnFollow
    
}