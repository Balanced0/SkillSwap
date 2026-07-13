"use client";

import { Bars } from "@gravity-ui/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { skillApi } from "@/lib/api";
import type { Member } from "@/lib/types";

const publicLinks = [
  ["Explore", "/explore"],
  ["Learn Board", "/wants"],
  ["How it works", "/how-it-works"],
  ["About", "/about"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => skillApi.me().then(({ user }) => setMember(user)).catch(() => setMember(null)), 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const signedInLinks = member
    ? [
        ["Explore", "/explore"],
        ["Learn Board", "/wants"],
        ["My sessions", "/sessions"],
        ["Ledger", "/ledger"],
        ["Dashboard", "/dashboard"],
      ]
    : publicLinks;

  async function signOut() {
    await authClient.signOut();
    setMember(null);
    router.push("/");
  }

  return (
    <header className="site-header">
      <nav className="shell nav" aria-label="Main navigation">
        <Link className="wordmark" href="/" onClick={() => setMenuOpen(false)}>
          SKILLSWAP
        </Link>
        <div className="nav-links">
          {signedInLinks.map(([label, href]) => (
            <Link className={pathname === href ? "active" : ""} href={href} key={href}>
              {label}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          {member ? (
            <>
              <span className="credit-pill">{member.creditBalance} credits</span>
              <Link className="profile-link" href="/profile">
                {member.name.split(" ")[0]}
              </Link>
              <button className="button button-dark compact" type="button" onClick={() => { void signOut(); }}>
                Sign out
              </button>
            </>
          ) : (
            <Link className="button button-dark compact" href="/login">
              Sign in
            </Link>
          )}
        </div>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
          <Bars />
        </button>
      </nav>
      {menuOpen && (
        <div className="mobile-nav shell">
          {signedInLinks.map(([label, href]) => (
            <Link href={href} key={href} onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
          {member ? (
            <>
              <Link href="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button type="button" onClick={() => { void signOut(); }}>Sign out</button>
            </>
          ) : (
            <Link href="/register" onClick={() => setMenuOpen(false)}>Create an account</Link>
          )}
        </div>
      )}
    </header>
  );
}
