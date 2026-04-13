import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { unauthorized } from "../utils/httpError.js";
import { User } from "../models/User.js";

export async function auth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) throw unauthorized("Missing Bearer token");

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.sub).select("-passwordHash");
    if (!user) throw unauthorized("User not found");

    req.user = user;
    next();
  } catch (e) {
    next(unauthorized("Invalid or expired token"));
  }
}
