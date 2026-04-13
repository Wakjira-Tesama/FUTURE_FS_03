import { Router } from "express";
import { z } from "zod";

import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { badRequest, notFound } from "../utils/httpError.js";
import { Booking } from "../models/Booking.js";
import { User } from "../models/User.js";
import { Notification } from "../models/Notification.js";

export function bookingsRouterFactory(realtime) {
  const router = Router();

  router.get(
    "/bookings",
    auth,
    asyncHandler(async (req, res) => {
      const role = req.user.role;
      const filter = {};

      if (role === "member") filter.memberId = req.user._id;
      if (role === "trainer") filter.trainerId = req.user._id;
      if (role === "admin") {
        // allow all
      }

      const bookings = await Booking.find(filter)
        .sort({ startAt: 1 })
        .limit(200);
      res.json({ bookings });
    }),
  );

  const CreateSchema = z.object({
    trainerId: z.string().min(1),
    startAt: z.string().datetime(),
    durationMinutes: z.number().int().min(15).max(180).default(60),
    notes: z.string().max(500).optional(),
  });

  router.post(
    "/bookings",
    auth,
    requireRole("member"),
    asyncHandler(async (req, res) => {
      const parsed = CreateSchema.safeParse(req.body);
      if (!parsed.success)
        throw badRequest("Invalid payload", parsed.error.flatten());

      const trainer = await User.findById(parsed.data.trainerId).select("role");
      if (!trainer || trainer.role !== "trainer")
        throw badRequest("Invalid trainerId");

      const startAt = new Date(parsed.data.startAt);
      const endAt = new Date(
        startAt.getTime() + parsed.data.durationMinutes * 60_000,
      );

      // Prevent overlapping bookings for trainer.
      const overlapping = await Booking.findOne({
        trainerId: trainer._id,
        status: "booked",
        startAt: { $lt: endAt },
        endAt: { $gt: startAt },
      });
      if (overlapping)
        throw badRequest("Trainer not available for that time slot");

      const booking = await Booking.create({
        memberId: req.user._id,
        trainerId: trainer._id,
        startAt,
        endAt,
        notes: parsed.data.notes,
      });

      await Notification.create({
        userId: trainer._id,
        type: "booking_created",
        title: "New booking",
        body: "A member booked a session.",
        data: { bookingId: booking._id },
      });

      realtime?.emit?.("booking.created", { bookingId: String(booking._id) }, [
        trainer._id,
        req.user._id,
      ]);

      res.status(201).json({ booking });
    }),
  );

  router.post(
    "/bookings/:id/cancel",
    auth,
    asyncHandler(async (req, res) => {
      const booking = await Booking.findById(req.params.id);
      if (!booking) throw notFound("Booking not found");

      const role = req.user.role;
      const canCancel =
        role === "admin" ||
        (role === "member" &&
          String(booking.memberId) === String(req.user._id)) ||
        (role === "trainer" &&
          String(booking.trainerId) === String(req.user._id));

      if (!canCancel) throw badRequest("Not allowed");

      booking.status = "canceled";
      booking.canceledAt = new Date();
      await booking.save();

      await Notification.create({
        userId: booking.memberId,
        type: "booking_canceled",
        title: "Booking canceled",
        body: "A booking was canceled.",
        data: { bookingId: booking._id },
      });
      await Notification.create({
        userId: booking.trainerId,
        type: "booking_canceled",
        title: "Booking canceled",
        body: "A booking was canceled.",
        data: { bookingId: booking._id },
      });

      realtime?.emit?.("booking.canceled", { bookingId: String(booking._id) }, [
        booking.trainerId,
        booking.memberId,
      ]);

      res.json({ booking });
    }),
  );

  return router;
}
