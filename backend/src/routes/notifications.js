import { Router } from "express";

import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Notification } from "../models/Notification.js";

export const notificationsRouter = Router();

notificationsRouter.get(
  "/notifications",
  auth,
  asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ notifications });
  }),
);

notificationsRouter.post(
  "/notifications/:id/read",
  auth,
  asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!notification) return res.json({ ok: true });
    notification.readAt = new Date();
    await notification.save();
    res.json({ ok: true });
  }),
);

notificationsRouter.delete(
  "/notifications/:id",
  auth,
  asyncHandler(async (req, res) => {
    await Notification.deleteOne({ _id: req.params.id, userId: req.user._id });
    res.json({ ok: true });
  }),
);

notificationsRouter.get(
  "/admin/notifications",
  auth,
  requireRole("admin"),
  asyncHandler(async (_req, res) => {
    const notifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .limit(200);
    res.json({ notifications });
  }),
);
