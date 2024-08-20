import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
email:{
    type:String,
    required:true
},
otp:{
    type:String,
    required:true
},createdAt:{
    type:Date,
    expires:60,
    default:Date.now
}
},{timestamps:true}) 

export default mongoose.model('otps',otpSchema);