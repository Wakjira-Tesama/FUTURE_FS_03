export type ApiErrorBody = {
  message?: string;
  details?: unknown;
};

export class ApiError extends Error {
  status: number;
  body?: ApiErrorBody;

  constructor(status: number, message: string, body?: ApiErrorBody) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function getStoredToken() {
  return localStorage.getItem("apexfit_token") || "";
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { json?: unknown; token?: string } = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  const token = init.token ?? getStoredToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const requestInit: RequestInit = { ...init, headers };

  if (init.json !== undefined) {
    headers.set("Content-Type", "application/json");
    requestInit.body = JSON.stringify(init.json);
  }

  const res = await fetch(
    path.startsWith("/") ? path : `/${path}`,
    requestInit,
  );

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = (
    isJson ? await res.json().catch(() => undefined) : undefined
  ) as ApiErrorBody | undefined;

  if (!res.ok) {
    throw new ApiError(res.status, body?.message || res.statusText, body);
  }

  return (body as T) ?? ({} as T);
}

export const authApi = {
  async register(payload: {
    email: string;
    password: string;
    fullName?: string;
  }) {
    return apiFetch<{ token: string; user: unknown }>("/api/auth/register", {
      method: "POST",
      json: payload,
    });
  },

  async login(payload: { email: string; password: string }) {
    return apiFetch<{ token: string; user: unknown }>("/api/auth/login", {
      method: "POST",
      json: payload,
    });
  },

  async me() {
    return apiFetch<{ user: unknown }>("/api/auth/me");
  },
};

export const membershipsApi = {
  async listPlans() {
    return apiFetch<{ plans: unknown[] }>("/api/memberships/plans");
  },

  async subscribe(
    payload: { planId: string; billingPeriod: "monthly" | "yearly" },
    token?: string,
  ) {
    return apiFetch<{ subscription: unknown }>("/api/memberships/subscribe", {
      method: "POST",
      json: payload,
      token,
    });
  },
};
