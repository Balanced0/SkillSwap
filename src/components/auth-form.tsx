"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    if (!email || !password) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    if (!isLogin) {
      if (!name) {
        setError("Please enter your name.");
        setIsSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      if (isLogin) {
        const response = await authClient.signIn.email({
          email,
          password,
          callbackURL: `${window.location.origin}/dashboard`,
        });
        if (response.error) {
          setError(response.error.message ?? "Invalid email or password.");
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        const response = await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: `${window.location.origin}/dashboard`,
        });
        if (response.error) {
          setError(response.error.message ?? "Registration failed.");
        } else {
          window.location.href = "/dashboard";
        }
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function continueWithGoogle() {
    setIsSubmitting(true);
    setMessage("");
    setError("");
    try {
      const response = await authClient.signIn.social({ provider: "google", callbackURL: `${window.location.origin}/dashboard` });
      if (response.error) setError(response.error.message ?? "Google sign-in could not be started.");
    } catch (err) { setError((err as Error).message); }
    finally { setIsSubmitting(false); }
  }

  async function handleDemoLogin() {
    setIsSubmitting(true);
    setMessage("");
    setError("");
    const demoEmail = "demo@skillswap.com";
    const demoPassword = "Password123!";
    
    // Auto-fill values
    setEmail(demoEmail);
    setPassword(demoPassword);

    try {
      // 1. Try to login
      const response = await authClient.signIn.email({
        email: demoEmail,
        password: demoPassword,
        callbackURL: `${window.location.origin}/dashboard`,
      });

      if (response.error) {
        // If demo user doesn't exist, register it automatically
        if (
          response.error.code === "INVALID_EMAIL_OR_PASSWORD" ||
          response.error.code === "USER_NOT_FOUND" ||
          response.error.message?.includes("not found") ||
          response.error.message?.toLowerCase().includes("invalid")
        ) {
          const signUpResponse = await authClient.signUp.email({
            email: demoEmail,
            password: demoPassword,
            name: "Demo Swapper",
            callbackURL: `${window.location.origin}/dashboard`,
          });
          if (signUpResponse.error) {
            setError(signUpResponse.error.message ?? "Could not create demo account.");
            return;
          }
          window.location.href = "/dashboard";
          return;
        }
        setError(response.error.message ?? "Demo sign-in failed.");
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-card">
        <p className="eyebrow rust">{isLogin ? "WELCOME BACK" : "YOUR COMMUNITY AWAITS"}</p>
        <h1>{isLogin ? "Sign in" : "Start swapping"}</h1>
        <p className="auth-copy">
          {isLogin
            ? "Continue swapping hours with your community."
            : "Register with your email or connect via Google. Two free credits are waiting for you."}
        </p>

        <form onSubmit={handleSubmit} className="auth-form" style={{ display: "grid", gap: "17px" }}>
          {!isLogin && (
            <label className="form-label">
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
                disabled={isSubmitting}
                style={{ marginTop: "6px" }}
              />
            </label>
          )}

          <label className="form-label">
            Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={isSubmitting}
              style={{ marginTop: "6px" }}
            />
          </label>

          <label className="form-label">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isSubmitting}
              style={{ marginTop: "6px" }}
            />
          </label>

          {!isLogin && (
            <label className="form-label">
              Confirm Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isSubmitting}
                style={{ marginTop: "6px" }}
              />
            </label>
          )}

          {error && <p className="form-message error">{error}</p>}
          {message && <p className="form-message success">{message}</p>}

          <button className="button button-rust full-width" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing…" : isLogin ? "Sign In" : "Create Account"}
          </button>

          {isLogin && (
            <button
              className="button button-outline full-width"
              type="button"
              disabled={isSubmitting}
              onClick={handleDemoLogin}
              style={{ marginTop: "5px" }}
            >
              Demo Login
            </button>
          )}

          <div style={{ display: "flex", alignItems: "center", margin: "10px 0", color: "var(--muted)" }}>
            <hr style={{ flex: 1, border: 0, borderTop: "1px solid var(--line)" }} />
            <span style={{ padding: "0 12px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-geist-mono), monospace" }}>or</span>
            <hr style={{ flex: 1, border: 0, borderTop: "1px solid var(--line)" }} />
          </div>

          <button
            className="button button-dark full-width google-button"
            type="button"
            disabled={isSubmitting}
            onClick={continueWithGoogle}
          >
            <span className="google-mark" aria-hidden="true">G</span>
            {isSubmitting ? "Connecting to Google…" : "Continue with Google"}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "New here?" : "Already swapping?"}{" "}
          <Link href={isLogin ? "/register" : "/login"}>
            {isLogin ? "Create an account" : "Sign in here"}
          </Link>
        </p>
        <Link className="back-home" href="/">
          ← Back home
        </Link>
      </section>
    </div>
  );
}
