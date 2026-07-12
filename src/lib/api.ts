import type { DashboardData, Listing, Member, Session, Transaction } from "@/lib/types";

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type ApiError = Error & { status?: number };

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("skillswap-token");
}

export function setToken(token: string) {
  window.localStorage.setItem("skillswap-token", token);
}

export function clearToken() {
  window.localStorage.removeItem("skillswap-token");
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body = (await response.json().catch(() => ({}))) as { message?: string } & T;
  if (!response.ok) {
    const error = new Error(body.message ?? "Something went wrong. Please try again.") as ApiError;
    error.status = response.status;
    throw error;
  }

  return body;
}

export const skillApi = {
  stats: () => api<{ hoursSwapped: number; sessionsCompleted: number; skillsListed: number; members: number }>("/platform/stats"),
  featuredListings: () => api<{ listings: Listing[] }>("/listings?limit=4&sort=rating"),
  listings: (query = "") => api<{ listings: Listing[]; page: number; pages: number; total: number }>(`/listings${query}`),
  listing: (id: string) => api<{ listing: Listing; reviews: Review[]; relatedListings: Listing[] }>(`/listings/${id}`),
  createListing: (data: Record<string, unknown>) => api<{ listing: Listing }>("/listings", { method: "POST", body: JSON.stringify(data) }),
  updateListing: (id: string, data: Record<string, unknown>) => api<{ listing: Listing }>(`/listings/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteListing: (id: string) => api<{ message: string }>(`/listings/${id}`, { method: "DELETE" }),
  myListings: () => api<{ listings: Listing[] }>("/listings/mine"),
  register: (data: Record<string, unknown>) => api<{ token: string; user: Member }>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: Record<string, unknown>) => api<{ token: string; user: Member }>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  demoLogin: () => api<{ token: string; user: Member }>("/auth/demo", { method: "POST" }),
  me: () => api<{ user: Member }>("/auth/me"),
  updateProfile: (data: Record<string, unknown>) => api<{ user: Member }>("/auth/me", { method: "PATCH", body: JSON.stringify(data) }),
  requestSession: (data: { listingId: string; proposedTime: string }) => api<{ session: Session }>("/sessions", { method: "POST", body: JSON.stringify(data) }),
  sessions: () => api<{ sessions: Session[] }>("/sessions/mine"),
  updateSession: (id: string, action: "accept" | "decline" | "cancel" | "confirm-complete") => api<{ session: Session; message: string }>(`/sessions/${id}/${action}`, { method: "POST" }),
  dashboard: () => api<DashboardData>("/dashboard"),
  ledger: () => api<{ balance: number; transactions: Transaction[] }>("/ledger"),
  createReview: (data: { sessionId: string; rating: number; comment: string }) => api<{ review: Review }>("/reviews", { method: "POST", body: JSON.stringify(data) }),
};

export type Review = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: Pick<Member, "_id" | "name" | "avatarUrl">;
};
