import mongoose from "mongoose";
const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
    },

    otp: {
        type: String,
        default: null
    },
    otpExpiresAt: {
        type: Date,
        default: null
    },
})

const User = mongoose.model("User",userSchema)
export default User