import Tweet from "../models/tweetSchema.js";
import User from "../models/userSchema.js";

const CreateTweet = async (req, res) => {
  try {
    const { postText, id } = req.body;
    if (!postText && postText.length == 0 && !id) {
      return res.status(401).json({
        msg: "Text are required",
        success: false,
      });
    }
    const user= await User.findById(id);
    const newTweet = await Tweet.create({
      discription: postText,
      userDetail:user,
      userid: id,
    });

    return res.status(200).json({
      msg: "Tweet created succefully",
      tweet: newTweet,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      msg: error.message,
      success: false,
    });
  }
};

const DeleteTweet = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const status = await Tweet.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Tweet deleted",
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      msg: error.message,
      success: false,
    });
  }
};

const LikeOrDislike = async (req, res) => {
  try {
    const loginuserId = req.body.userid;
    const tweetId = req.params.id;

    const tweet = await Tweet.findById(tweetId);
    if (tweet.likes.includes(loginuserId)) {
      //remove
      await Tweet.findByIdAndUpdate(tweetId, { $pull: { likes: loginuserId } });
      return res.status(200).json({
        msg: "disliked succefylly",
        success: true,
      });
    } else {
      //add
      await Tweet.findByIdAndUpdate(tweetId, { $push: { likes: loginuserId } });
      return res.status(200).json({
        msg: "Liked succefylly",
        success: true,
      });
    }
  } catch (error) {
   return res.status(400).json({
      msg: error.message,
      success: false,
    });
  }
};

const GetAllTweets= async (req,res)=>{
  // user can see own and follwers tweets
  try {
    const logedinUserId= req.params.id;
    const user= await User.findById(logedinUserId);
    const logedinUserTweets= await Tweet.find({userid:logedinUserId});
    const followingsUserTweets= await Promise.all(user.followings.map((otherUserId)=>{
      return Tweet.find({userid:otherUserId});
    }))

    console.log("fooloTweet",followingsUserTweets);

    return res.status(200).json({
      msg: "feched succefylly",
      alltweets:logedinUserTweets.concat(...followingsUserTweets),
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      msg: error.message,
      success: false,
    });
  }
}

const GetFollowingTweet= async(req,res)=>{
  try {
    const logedinUserId= req.params.id;
    const user= await User.findById(logedinUserId);
    const followingsUserTweets= await Promise.all(user.followings.map((otherUserId)=>{
      return Tweet.find({userid:otherUserId});
    }))

    return res.status(200).json({
      msg: "feched succefylly",
      alltweets:followingsUserTweets,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      msg: error.message,
      success: false,
    });
  }
}
export { CreateTweet, DeleteTweet, LikeOrDislike,GetAllTweets,GetFollowingTweet };
