import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true
    },
    bookmark:{
        type:Array,
        default:[]
    },
    followers:{
        type:Array,
        default:[],
    },
    followings:{
        type:Array,
        default:[]
    }
},{timeseries:true});

export default mongoose.model("User",userSchema);