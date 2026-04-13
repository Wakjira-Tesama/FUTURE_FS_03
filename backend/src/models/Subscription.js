import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipPlan",
      required: true,
    },
    billingPeriod: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "canceled", "past_due"],
      default: "active",
      index: true,
    },
    startedAt: { type: Date, default: () => new Date() },
    canceledAt: { type: Date },
    renewsAt: { type: Date },
    lastPayment: {
      provider: { type: String, default: "stripe_sim" },
      amountCents: { type: Number },
      paidAt: { type: Date },
      reference: { type: String },
    },
  },
  { timestamps: true },
);

export const Subscription = mongoose.model("Subscription", SubscriptionSchema);
