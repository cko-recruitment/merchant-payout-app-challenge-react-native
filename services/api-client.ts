import type { ZodType } from "zod";
import { API_BASE_URL } from "@/constants";

export class APIError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options?: RequestInit,
  schema?: ZodType<T>,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "content-type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => {
      return { error: res.statusText };
    });

    throw new APIError(res.status, body.error ?? `HTTP ${res.status}`);
  }

  const data = await res.json();
  return schema ? schema.parse(data) : (data as T);
}

export const apiClient = {
  get: <T>(path: string, schema?: ZodType<T>): Promise<T> =>
    request<T>(path, undefined, schema),
  post: <T>(path: string, body: unknown, schema?: ZodType<T>): Promise<T> =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }, schema),
};
