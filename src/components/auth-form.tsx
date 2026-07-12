"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function continueWithGoogle() {
    setIsSubmitting(true);
    setMessage("");
    try {
      const response = await authClient.signIn.social({ provider: "google", callbackURL: `${window.location.origin}/dashboard` });
      if (response.error) setMessage(response.error.message ?? "Google sign-in could not be started.");
    } catch (error) { setMessage((error as Error).message); }
    finally { setIsSubmitting(false); }
  }
  return <div className="auth-page"><section className="auth-card"><p className="eyebrow rust">{isLogin ? "WELCOME BACK" : "YOUR COMMUNITY AWAITS"}</p><h1>{isLogin ? "Sign in" : "Start swapping"}</h1><p className="auth-copy">{isLogin ? "Continue swapping hours with your community." : "Your Google account is all you need. Two free credits are waiting for your first two lessons."}</p><div className="auth-form"><button className="button button-dark full-width google-button" type="button" disabled={isSubmitting} onClick={continueWithGoogle}><span className="google-mark" aria-hidden="true">G</span>{isSubmitting ? "Connecting to Google…" : "Continue with Google"}</button>{message && <p className="form-message error">{message}</p>}</div><p className="auth-switch">{isLogin ? "New here?" : "Already swapping?"} <Link href={isLogin ? "/register" : "/login"}>{isLogin ? "Continue with Google" : "Sign in with Google"}</Link></p><Link className="back-home" href="/">← Back home</Link></section></div>;
}
