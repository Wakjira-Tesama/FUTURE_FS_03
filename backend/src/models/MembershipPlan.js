import mongoose from "mongoose";

const MembershipPlanSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    monthlyPriceCents: { type: Number, required: true, min: 0 },
    yearlyPriceCents: { type: Number, required: true, min: 0 },
    features: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const MembershipPlan = mongoose.model(
  "MembershipPlan",
  MembershipPlanSchema,
);
