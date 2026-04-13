import { Router } from "express";
import { z } from "zod";

import { auth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { badRequest } from "../utils/httpError.js";
import { ProgressEntry } from "../models/ProgressEntry.js";

export const progressRouter = Router();

progressRouter.get(
  "/progress",
  auth,
  asyncHandler(async (req, res) => {
    const { from, to } = req.query;
    const filter = { userId: req.user._id };

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(String(from));
      if (to) filter.date.$lte = new Date(String(to));
    }

    const entries = await ProgressEntry.find(filter)
      .sort({ date: 1 })
      .limit(365);
    res.json({ entries });
  }),
);

const UpsertSchema = z.object({
  date: z.string().datetime(),
  weightKg: z.number().min(0).max(1000).optional(),
  calories: z.number().int().min(0).max(100000).optional(),
  workoutMinutes: z.number().int().min(0).max(1000).optional(),
  workoutCompleted: z.boolean().optional(),
  notes: z.string().max(500).optional(),
});

progressRouter.put(
  "/progress",
  auth,
  asyncHandler(async (req, res) => {
    const parsed = UpsertSchema.safeParse(req.body);
    if (!parsed.success)
      throw badRequest("Invalid payload", parsed.error.flatten());

    const date = new Date(parsed.data.date);

    const entry = await ProgressEntry.findOneAndUpdate(
      { userId: req.user._id, date },
      { $set: { ...parsed.data, userId: req.user._id, date } },
      { upsert: true, new: true },
    );

    res.json({ entry });
  }),
);

progressRouter.get(
  "/progress/summary",
  auth,
  asyncHandler(async (req, res) => {
    const entries = await ProgressEntry.find({ userId: req.user._id })
      .sort({ date: 1 })
      .limit(365);

    const last = entries[entries.length - 1] || null;
    const workoutsCompleted = entries.filter((e) => e.workoutCompleted).length;

    res.json({
      summary: {
        lastEntry: last,
        workoutsCompleted,
        entriesCount: entries.length,
      },
    });
  }),
);
