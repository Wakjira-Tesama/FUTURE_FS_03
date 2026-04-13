import { Router } from "express";
import { z } from "zod";

import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { badRequest, notFound } from "../utils/httpError.js";
import { User, USER_ROLES } from "../models/User.js";

export const usersRouter = Router();

usersRouter.get(
  "/users",
  auth,
  requireRole("admin"),
  asyncHandler(async (_req, res) => {
    const users = await User.find()
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .limit(200);
    res.json({ users });
  }),
);

usersRouter.get(
  "/users/:id",
  auth,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) throw notFound("User not found");
    res.json({ user });
  }),
);

const UpdateRoleSchema = z.object({ role: z.enum(USER_ROLES) });
usersRouter.patch(
  "/users/:id/role",
  auth,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const parsed = UpdateRoleSchema.safeParse(req.body);
    if (!parsed.success)
      throw badRequest("Invalid payload", parsed.error.flatten());

    const user = await User.findById(req.params.id);
    if (!user) throw notFound("User not found");

    user.role = parsed.data.role;
    await user.save();

    res.json({ user: await User.findById(user._id).select("-passwordHash") });
  }),
);

const UpdateProfileSchema = z.object({
  fullName: z.string().min(1).max(120).optional(),
  phone: z.string().min(3).max(30).optional(),
  gender: z.string().max(30).optional(),
  heightCm: z.number().int().positive().max(300).optional(),
  dateOfBirth: z.string().datetime().optional(),
  goals: z.array(z.string().min(1).max(40)).optional(),
});

usersRouter.patch(
  "/users/me/profile",
  auth,
  asyncHandler(async (req, res) => {
    const parsed = UpdateProfileSchema.safeParse(req.body);
    if (!parsed.success)
      throw badRequest("Invalid payload", parsed.error.flatten());

    const user = await User.findById(req.user._id);
    if (!user) throw notFound("User not found");

    user.profile = {
      ...user.profile?.toObject?.(),
      ...parsed.data,
      ...(parsed.data.dateOfBirth
        ? { dateOfBirth: new Date(parsed.data.dateOfBirth) }
        : {}),
    };

    await user.save();
    res.json({ user: await User.findById(user._id).select("-passwordHash") });
  }),
);
