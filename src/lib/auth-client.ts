"use client";

import { createAuthClient } from "better-auth/react";
import { authBase } from "@/lib/api";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL ?? authBase,
});
