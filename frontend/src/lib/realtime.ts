type RealtimeHandlers = {
  onMessage?: (type: string, payload: unknown) => void;
  onConnected?: () => void;
  onError?: (message: string) => void;
  onClose?: () => void;
};

export function connectRealtime(
  token: string,
  handlers: RealtimeHandlers = {},
) {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const wsUrl = `${protocol}://${window.location.host}/ws?token=${encodeURIComponent(token)}`;

  const ws = new WebSocket(wsUrl);

  ws.addEventListener("message", (evt) => {
    try {
      const data = JSON.parse(String(evt.data)) as {
        type?: string;
        payload?: unknown;
        message?: string;
      };

      if (data.type === "connected") {
        handlers.onConnected?.();
        return;
      }

      if (data.type === "error") {
        handlers.onError?.(data.message || "error");
        return;
      }

      if (data.type) handlers.onMessage?.(data.type, data.payload);
    } catch {
      // ignore
    }
  });

  ws.addEventListener("close", () => handlers.onClose?.());

  return {
    ws,
    close() {
      ws.close();
    },
  };
}
