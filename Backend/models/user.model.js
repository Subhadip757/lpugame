import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["student", "teacher"],
            required: true,
        },
        quizzesCreated: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Quiz",
            },
        ], // Only for teachers
        quizzesTaken: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Quiz",
            },
        ], // Only for students
        scores: [
            {
                quizId: String,
                score: Number,
            },
        ],
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
    return (
        jwt.sign({
            _id: this._id,
            username: this.username,
            email: this.email,
            fullname: this.fullname,
        }),
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userSchema.methods.generateToken = async function (password) {
    return (
        jwt.sign({
            _id: this._id,
        }),
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
