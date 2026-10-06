"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, api } from "@/lib/client/api";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      router.push("/tickets");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Sign in failed.");
      setPending(false);
    }
  }

  return (
    <form className="card stack" onSubmit={onSubmit}>
      <label>
        Email
        <input
          type="email"
          name="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button type="submit" className="button" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </button>
      <aside className="hint">
        <p>Development accounts</p>
        <ul>
          <li>
            <code>user@example.com</code> — sees only their tickets
          </li>
          <li>
            <code>agent@example.com</code> — sees every ticket
          </li>
        </ul>
        <p>
          Password: <code>password123</code>
        </p>
      </aside>
    </form>
  );
}
