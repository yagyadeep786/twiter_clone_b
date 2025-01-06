import mongoose from "mongoose";

const tweetSchema= new mongoose.Schema({
    discription:{
        type:String,
        require:true
    },
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
    },
    comments:{
        type:Array,
        default:[]
    },
    likes:{
        type:Array,
        default:[],
    },
    retweets:{
        type:Array,
        default:[]
    },
    userDetail:{
        type:Object,
        default:{}
    },
    bookmarks:{
        type:Array,
        default:[]
    }
},{timeseries:true});

export default mongoose.model("Tweet",tweetSchema);