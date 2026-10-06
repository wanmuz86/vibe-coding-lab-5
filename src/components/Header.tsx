"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { CurrentUser } from "@/lib/auth/types";
import { api } from "@/lib/client/api";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<{ user: CurrentUser }>("/api/auth/me")
      .then((data) => {
        if (!cancelled) {
          setUser(data.user);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="site-header">
      <Link href="/tickets" className="brand">
        Support Tickets
      </Link>
      {user ? (
        <div className="header-user">
          <span>
            {user.name}{" "}
            <span className="role">{user.role === "AGENT" ? "Agent" : "User"}</span>
          </span>
          <button type="button" className="button button-quiet" onClick={logout}>
            Sign out
          </button>
        </div>
      ) : null}
    </header>
  );
}
