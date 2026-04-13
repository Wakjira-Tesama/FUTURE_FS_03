import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    startAt: { type: Date, required: true, index: true },
    endAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["booked", "canceled", "completed"],
      default: "booked",
      index: true,
    },
    notes: { type: String },
    canceledAt: { type: Date },
  },
  { timestamps: true },
);

BookingSchema.index({ trainerId: 1, startAt: 1, endAt: 1 });

export const Booking = mongoose.model("Booking", BookingSchema);
