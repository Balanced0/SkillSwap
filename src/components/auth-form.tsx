"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setToken, skillApi } from "@/lib/api";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const isLogin = mode === "login";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", location: "" });

  function update(field: keyof typeof form, value: string) { setForm((current) => ({ ...current, [field]: value })); }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setIsSubmitting(true); setMessage("");
    try {
      const response = isLogin ? await skillApi.login({ email: form.email, password: form.password }) : await skillApi.register(form);
      setToken(response.token); router.push("/dashboard");
    } catch (error) { setMessage((error as Error).message); }
    finally { setIsSubmitting(false); }
  }
  async function useDemo() {
    setIsSubmitting(true); setMessage("");
    try { const response = await skillApi.demoLogin(); setToken(response.token); router.push("/dashboard"); }
    catch (error) { setMessage((error as Error).message); }
    finally { setIsSubmitting(false); }
  }
  return <div className="auth-page"><section className="auth-card"><p className="eyebrow rust">{isLogin ? "WELCOME BACK" : "YOUR COMMUNITY AWAITS"}</p><h1>{isLogin ? "Sign in" : "Start swapping"}</h1><p className="auth-copy">{isLogin ? "Continue swapping hours with your community." : "Two free credits are waiting for your first two lessons."}</p><form className="auth-form" onSubmit={submit}>{!isLogin && <><label className="form-label">Name<input required value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Your name" /></label><label className="form-label">Location <small>(optional)</small><input value={form.location} onChange={(event) => update("location", event.target.value)} placeholder="City, country" /></label></>}<label className="form-label">Email<input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" autoComplete="email" /></label><label className="form-label">Password<input required minLength={8} type="password" value={form.password} onChange={(event) => update("password", event.target.value)} placeholder="At least 8 characters" autoComplete={isLogin ? "current-password" : "new-password"} /></label>{message && <p className="form-message error">{message}</p>}<button className="button button-rust full-width" type="submit" disabled={isSubmitting}>{isSubmitting ? "Please wait…" : isLogin ? "Sign in" : "Create account"}</button></form>{isLogin && <button className="demo-button" type="button" disabled={isSubmitting} onClick={useDemo}>Try the working demo account →</button>}<p className="auth-switch">{isLogin ? "New here?" : "Already swapping?"} <Link href={isLogin ? "/register" : "/login"}>{isLogin ? "Create an account" : "Sign in"}</Link></p><Link className="back-home" href="/">← Back home</Link></section></div>;
}
