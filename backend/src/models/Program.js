import mongoose from "mongoose";

const ProgramSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Strength", "Cardio", "Yoga", "CrossFit", "Nutrition"],
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
      index: true,
    },
    summary: { type: String },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Program = mongoose.model("Program", ProgramSchema);
