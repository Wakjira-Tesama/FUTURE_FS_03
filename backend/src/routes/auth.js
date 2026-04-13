import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { asyncHandler } from "../utils/asyncHandler.js";
import { badRequest } from "../utils/httpError.js";
import { User, USER_ROLES } from "../models/User.js";
import { signAccessToken } from "../services/token.js";
import { auth } from "../middleware/auth.js";

export const authRouter = Router();

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
  fullName: z.string().min(1).max(120).optional(),
});

authRouter.post(
  "/auth/register",
  asyncHandler(async (req, res) => {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success)
      throw badRequest("Invalid payload", parsed.error.flatten());

    const { email, password, fullName } = parsed.data;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) throw badRequest("Email already in use");

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      role: "member",
      profile: { fullName },
    });

    const token = signAccessToken(user._id);
    res.status(201).json({ token, user: sanitizeUser(user) });
  }),
);

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post(
  "/auth/login",
  asyncHandler(async (req, res) => {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success)
      throw badRequest("Invalid payload", parsed.error.flatten());

    const { email, password } = parsed.data;
    const user = await User.findOne({
      email: email.toLowerCase(),
      isActive: true,
    });
    if (!user) throw badRequest("Invalid credentials");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw badRequest("Invalid credentials");

    user.lastLoginAt = new Date();
    await user.save();

    const token = signAccessToken(user._id);
    res.json({ token, user: sanitizeUser(user) });
  }),
);

authRouter.get(
  "/auth/me",
  auth,
  asyncHandler(async (req, res) => {
    res.json({ user: req.user });
  }),
);

// Minimal placeholder endpoints for password reset workflow.
const PasswordResetRequestSchema = z.object({ email: z.string().email() });
authRouter.post(
  "/auth/password-reset/request",
  asyncHandler(async (req, res) => {
    const parsed = PasswordResetRequestSchema.safeParse(req.body);
    if (!parsed.success)
      throw badRequest("Invalid payload", parsed.error.flatten());

    // In a real system you'd create a token, email it, and store hashed token + expiry.
    // Here we intentionally do not reveal whether the email exists.
    res.json({ ok: true });
  }),
);

const PasswordResetSchema = z.object({
  token: z.string().min(8),
  newPassword: z.string().min(8),
});
authRouter.post(
  "/auth/password-reset/confirm",
  asyncHandler(async (req, res) => {
    const parsed = PasswordResetSchema.safeParse(req.body);
    if (!parsed.success)
      throw badRequest("Invalid payload", parsed.error.flatten());

    // Placeholder.
    res.json({ ok: true });
  }),
);

function sanitizeUser(user) {
  return {
    id: String(user._id),
    email: user.email,
    role: USER_ROLES.includes(user.role) ? user.role : "member",
    profile: user.profile,
    trainerId: user.trainerId ? String(user.trainerId) : null,
    createdAt: user.createdAt,
  };
}
