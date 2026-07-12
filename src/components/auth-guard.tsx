"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { skillApi } from "@/lib/api";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      skillApi.me().then(() => setChecked(true)).catch(() => router.replace("/login"));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [router]);

  if (!checked) return <div className="shell page-loading"><div className="skeleton title" /><div className="skeleton card" /></div>;
  return <>{children}</>;
}
