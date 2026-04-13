import mongoose from "mongoose";

const ProgressEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: { type: Date, required: true, index: true },
    weightKg: { type: Number },
    calories: { type: Number },
    workoutMinutes: { type: Number },
    workoutCompleted: { type: Boolean },
    notes: { type: String },
  },
  { timestamps: true },
);

ProgressEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

export const ProgressEntry = mongoose.model(
  "ProgressEntry",
  ProgressEntrySchema,
);
