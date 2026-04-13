import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: { type: String, required: true, index: true },
    title: { type: String, required: true },
    body: { type: String },
    data: { type: Object },
    readAt: { type: Date },
  },
  { timestamps: true },
);

export const Notification = mongoose.model("Notification", NotificationSchema);
