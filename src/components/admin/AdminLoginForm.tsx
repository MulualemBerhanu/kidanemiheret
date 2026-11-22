"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Login failed");
      router.replace(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-6">
      <div>
        <label htmlFor="admin-password" className="admin-label">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-field"
          placeholder="Enter admin password"
          required
        />
      </div>

      {error && (
        <p className="rounded-[2px] border border-red-300/60 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="relative w-full overflow-hidden rounded-[2px] bg-gradient-to-r from-[#8b6914] via-gold to-amber px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal shadow-[0_2px_20px_rgba(212,175,55,0.25)] transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-xs leading-relaxed text-charcoal/45">
        Production uses <span className="font-medium text-charcoal/65">ADMIN_PASSWORD</span>.
        Local default is <span className="font-medium text-charcoal/65">admin</span>.
      </p>
    </form>
  );
}
