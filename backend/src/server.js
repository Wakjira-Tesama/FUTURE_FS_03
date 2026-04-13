import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";
import { connectDb } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

import { healthRouter } from "./routes/health.js";
import { authRouter } from "./routes/auth.js";
import { usersRouter } from "./routes/users.js";
import { programsRouter } from "./routes/programs.js";
import { membershipsRouter } from "./routes/memberships.js";
import { bookingsRouterFactory } from "./routes/bookings.js";
import { progressRouter } from "./routes/progress.js";
import { blogRouter } from "./routes/blog.js";
import { notificationsRouter } from "./routes/notifications.js";

import { createRealtimeServer } from "./services/realtime.js";
import { MembershipPlan } from "./models/MembershipPlan.js";

await connectDb();

await ensureDefaultMembershipPlans();

const app = express();
app.disable("x-powered-by");

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(",")
      .map((o) => o.trim())
      .filter(Boolean),
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 60_000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

const httpServer = http.createServer(app);
const realtime = createRealtimeServer(httpServer);

app.use("/api", healthRouter);
app.use("/api", authRouter);
app.use("/api", usersRouter);
app.use("/api", programsRouter);
app.use("/api", membershipsRouter);
app.use("/api", bookingsRouterFactory({ emit: realtime.emit }));
app.use("/api", progressRouter);
app.use("/api", blogRouter);
app.use("/api", notificationsRouter);

app.use(errorHandler);

httpServer.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${env.PORT}`);
});

async function ensureDefaultMembershipPlans() {
  const count = await MembershipPlan.countDocuments();
  if (count > 0) return;

  await MembershipPlan.insertMany([
    {
      code: "BASIC",
      name: "Basic",
      description: "Perfect for getting started",
      monthlyPriceCents: 2900,
      yearlyPriceCents: 2900 * 10,
      features: [
        "Gym access (6AM–10PM)",
        "Basic equipment usage",
        "Locker room access",
        "1 group class/week",
        "Mobile app access",
      ],
      isActive: true,
    },
    {
      code: "PRO",
      name: "Pro",
      description: "Most popular for serious athletes",
      monthlyPriceCents: 5900,
      yearlyPriceCents: 5900 * 10,
      features: [
        "24/7 gym access",
        "All equipment & zones",
        "Unlimited group classes",
        "1 personal training/month",
        "AI workout planner",
        "Progress tracking",
        "Nutrition guidance",
      ],
      isActive: true,
    },
    {
      code: "ELITE",
      name: "Elite",
      description: "The ultimate fitness experience",
      monthlyPriceCents: 9900,
      yearlyPriceCents: 9900 * 10,
      features: [
        "Everything in Pro",
        "4 personal trainings/month",
        "Custom meal plans",
        "Recovery & spa access",
        "Priority booking",
        "1-on-1 coaching",
        "Exclusive events",
        "Guest passes (2/month)",
      ],
      isActive: true,
    },
  ]);

  // eslint-disable-next-line no-console
  console.log("Seeded default membership plans");
}
