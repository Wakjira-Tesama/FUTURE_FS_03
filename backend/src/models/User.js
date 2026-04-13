import mongoose from "mongoose";

export const USER_ROLES = ["visitor", "member", "trainer", "admin"];

const ProfileSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true },
    phone: { type: String, trim: true },
    gender: { type: String, trim: true },
    heightCm: { type: Number },
    dateOfBirth: { type: Date },
    goals: { type: [String], default: [] },
  },
  { _id: false },
);

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: USER_ROLES, default: "member", index: true },
    profile: { type: ProfileSchema, default: {} },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", UserSchema);
