import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * Minimal realtime service:
 * - clients connect with ws://host/ws?token=JWT
 * - we store connections by userId (jwt.sub)
 * - emit(event, payload, userIds?) broadcasts events
 */

export function createRealtimeServer(httpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  const clientsByUserId = new Map(); // userId => Set(ws)

  function addClient(userId, ws) {
    const key = String(userId);
    const set = clientsByUserId.get(key) || new Set();
    set.add(ws);
    clientsByUserId.set(key, set);
  }

  function removeClient(userId, ws) {
    const key = String(userId);
    const set = clientsByUserId.get(key);
    if (!set) return;
    set.delete(ws);
    if (set.size === 0) clientsByUserId.delete(key);
  }

  function send(ws, data) {
    try {
      if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  function broadcast(data, userIds) {
    if (!userIds) {
      for (const set of clientsByUserId.values()) {
        for (const ws of set) send(ws, data);
      }
      return;
    }

    for (const userId of userIds) {
      const set = clientsByUserId.get(String(userId));
      if (!set) continue;
      for (const ws of set) send(ws, data);
    }
  }

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get("token");

    let userId = null;
    try {
      const decoded = jwt.verify(token || "", env.JWT_SECRET);
      userId = decoded.sub;
    } catch {
      send(ws, { type: "error", message: "unauthorized" });
      ws.close();
      return;
    }

    addClient(userId, ws);
    send(ws, { type: "connected" });

    ws.on("close", () => removeClient(userId, ws));
  });

  return {
    emit(event, payload, userIds) {
      broadcast({ type: event, payload }, userIds);
    },
  };
}
