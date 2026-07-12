"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/api";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    const timer = window.setTimeout(() => setChecked(true), 0);
    return () => window.clearTimeout(timer);
  }, [router]);

  if (!checked) return <div className="shell page-loading"><div className="skeleton title" /><div className="skeleton card" /></div>;
  return <>{children}</>;
}
