import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.string().optional().default("development"),
  PORT: z.coerce.number().int().positive().optional().default(4000),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().optional().default("7d"),
  // Comma-separated allowed origins. Example:
  // "http://localhost:5173,http://localhost:8082"
  CORS_ORIGIN: z
    .string()
    .optional()
    .default("http://localhost:5173,http://localhost:8082"),
});

export const env = EnvSchema.parse(process.env);
