import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";

export default async function AdminLoginPage() {
  const jar = await cookies();
  if (verifyAdminSessionToken(jar.get(ADMIN_SESSION_COOKIE)?.value)) {
    redirect("/admin");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5 py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(212,175,55,0.18), transparent 40%), radial-gradient(circle at 80% 80%, rgba(122,92,24,0.12), transparent 45%)",
        }}
        aria-hidden
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="font-amharic text-3xl text-gold md:text-4xl">ኪዳነ ምሕረት</p>
          <h1 className="mt-3 font-display text-3xl text-charcoal md:text-4xl">Admin sign in</h1>
          <p className="mt-2 text-sm text-charcoal/55">
            Manage parish events, banners, dates, and places
          </p>
          <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        <div className="admin-card px-6 py-8 md:px-8">
          <Suspense fallback={<p className="text-sm text-charcoal/50">Loading…</p>}>
            <AdminLoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center">
          <a
            href="/en"
            className="text-xs uppercase tracking-[0.18em] text-charcoal/40 transition hover:text-gold"
          >
            ← Back to website
          </a>
        </p>
      </div>
    </div>
  );
}
