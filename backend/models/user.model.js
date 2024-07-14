//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    gender: {
        type: String,
        enum: ["male", "female"],
    },
},
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;