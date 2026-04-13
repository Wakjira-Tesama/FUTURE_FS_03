import { Router } from "express";
import { z } from "zod";

import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { badRequest, notFound } from "../utils/httpError.js";
import { Program } from "../models/Program.js";

export const programsRouter = Router();

programsRouter.get(
  "/programs",
  asyncHandler(async (req, res) => {
    const { category, difficulty } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const programs = await Program.find(filter)
      .sort({ createdAt: -1 })
      .limit(200);
    res.json({ programs });
  }),
);

const ProgramSchema = z.object({
  title: z.string().min(1).max(120),
  category: z.enum(["Strength", "Cardio", "Yoga", "CrossFit", "Nutrition"]),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  summary: z.string().max(400).optional(),
  trainerId: z.string().optional(),
  isActive: z.boolean().optional(),
});

programsRouter.post(
  "/programs",
  auth,
  requireRole("admin", "trainer"),
  asyncHandler(async (req, res) => {
    const parsed = ProgramSchema.safeParse(req.body);
    if (!parsed.success)
      throw badRequest("Invalid payload", parsed.error.flatten());

    const program = await Program.create({
      ...parsed.data,
      trainerId:
        parsed.data.trainerId ||
        (req.user.role === "trainer" ? req.user._id : undefined),
    });

    res.status(201).json({ program });
  }),
);

programsRouter.patch(
  "/programs/:id",
  auth,
  requireRole("admin", "trainer"),
  asyncHandler(async (req, res) => {
    const parsed = ProgramSchema.partial().safeParse(req.body);
    if (!parsed.success)
      throw badRequest("Invalid payload", parsed.error.flatten());

    const program = await Program.findById(req.params.id);
    if (!program) throw notFound("Program not found");

    if (
      req.user.role === "trainer" &&
      String(program.trainerId || "") !== String(req.user._id)
    ) {
      throw badRequest("Cannot edit a program owned by another trainer");
    }

    Object.assign(program, parsed.data);
    await program.save();

    res.json({ program });
  }),
);

programsRouter.delete(
  "/programs/:id",
  auth,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const program = await Program.findById(req.params.id);
    if (!program) throw notFound("Program not found");
    await program.deleteOne();
    res.json({ ok: true });
  }),
);
