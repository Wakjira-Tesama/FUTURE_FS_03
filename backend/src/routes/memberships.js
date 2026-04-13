import { Router } from "express";
import { z } from "zod";

import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { badRequest, notFound } from "../utils/httpError.js";
import { MembershipPlan } from "../models/MembershipPlan.js";
import { Subscription } from "../models/Subscription.js";
import { Notification } from "../models/Notification.js";

export const membershipsRouter = Router();

membershipsRouter.get(
  "/memberships/plans",
  asyncHandler(async (_req, res) => {
    const plans = await MembershipPlan.find({ isActive: true }).sort({
      monthlyPriceCents: 1,
    });
    res.json({ plans });
  }),
);

const PlanSchema = z.object({
  code: z
    .string()
    .min(2)
    .max(20)
    .transform((v) => v.toUpperCase()),
  name: z.string().min(1).max(60),
  description: z.string().max(500).optional(),
  monthlyPriceCents: z.number().int().min(0),
  yearlyPriceCents: z.number().int().min(0),
  features: z.array(z.string().min(1).max(80)).optional(),
  isActive: z.boolean().optional(),
});

membershipsRouter.post(
  "/memberships/plans",
  auth,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const parsed = PlanSchema.safeParse(req.body);
    if (!parsed.success)
      throw badRequest("Invalid payload", parsed.error.flatten());

    const plan = await MembershipPlan.create(parsed.data);
    res.status(201).json({ plan });
  }),
);

membershipsRouter.patch(
  "/memberships/plans/:id",
  auth,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const parsed = PlanSchema.partial().safeParse(req.body);
    if (!parsed.success)
      throw badRequest("Invalid payload", parsed.error.flatten());

    const plan = await MembershipPlan.findById(req.params.id);
    if (!plan) throw notFound("Plan not found");

    Object.assign(plan, parsed.data);
    await plan.save();

    res.json({ plan });
  }),
);

membershipsRouter.get(
  "/memberships/subscription",
  auth,
  asyncHandler(async (req, res) => {
    const sub = await Subscription.findOne({
      userId: req.user._id,
      status: "active",
    }).populate("planId");
    res.json({ subscription: sub });
  }),
);

const SubscribeSchema = z.object({
  planId: z.string().min(1),
  billingPeriod: z.enum(["monthly", "yearly"]),
});

membershipsRouter.post(
  "/memberships/subscribe",
  auth,
  asyncHandler(async (req, res) => {
    const parsed = SubscribeSchema.safeParse(req.body);
    if (!parsed.success)
      throw badRequest("Invalid payload", parsed.error.flatten());

    const plan = await MembershipPlan.findById(parsed.data.planId);
    if (!plan || !plan.isActive) throw notFound("Plan not found");

    // Cancel existing active subscription.
    await Subscription.updateMany(
      { userId: req.user._id, status: "active" },
      { $set: { status: "canceled", canceledAt: new Date() } },
    );

    const amount =
      parsed.data.billingPeriod === "monthly"
        ? plan.monthlyPriceCents
        : plan.yearlyPriceCents;
    const renewsAt = new Date();
    renewsAt.setDate(
      renewsAt.getDate() + (parsed.data.billingPeriod === "monthly" ? 30 : 365),
    );

    const sub = await Subscription.create({
      userId: req.user._id,
      planId: plan._id,
      billingPeriod: parsed.data.billingPeriod,
      status: "active",
      renewsAt,
      lastPayment: {
        provider: "stripe_sim",
        amountCents: amount,
        paidAt: new Date(),
        reference: `sim_${Date.now()}`,
      },
    });

    await Notification.create({
      userId: req.user._id,
      type: "payment_success",
      title: "Payment successful",
      body: `Subscribed to ${plan.name} (${parsed.data.billingPeriod}).`,
      data: { subscriptionId: sub._id },
    });

    res
      .status(201)
      .json({
        subscription: await Subscription.findById(sub._id).populate("planId"),
      });
  }),
);

membershipsRouter.post(
  "/memberships/cancel",
  auth,
  asyncHandler(async (req, res) => {
    const sub = await Subscription.findOne({
      userId: req.user._id,
      status: "active",
    });
    if (!sub) return res.json({ ok: true });

    sub.status = "canceled";
    sub.canceledAt = new Date();
    await sub.save();

    await Notification.create({
      userId: req.user._id,
      type: "subscription_canceled",
      title: "Subscription canceled",
      body: "Your subscription has been canceled.",
      data: { subscriptionId: sub._id },
    });

    res.json({ ok: true });
  }),
);
