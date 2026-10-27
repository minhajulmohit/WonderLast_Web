"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { LoaderCircle, Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim() ?? "";
    setIsSubmitting(true);

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw new Error(error.message || "Please try again.");
      }

      setRequestSent(true);
      toast.add({
        title: "Check your email",
        description: "If an account exists for this address, a reset link is on its way.",
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Could not send reset link",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-3rem)] items-center justify-center bg-slate-50 px-5 py-16 text-neutral-950 sm:py-20">
      <section className="w-full max-w-sm">
        <header className="mb-5 text-center">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Forgot Password?
          </h1>
          <p className="mt-1 text-[11px] text-neutral-500">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="border border-neutral-100 bg-white p-5 shadow-sm sm:p-6"
        >
          <label
            className="mb-1 block text-[11px] font-medium"
            htmlFor="forgot-password-email"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail
              aria-hidden="true"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500"
              size={13}
            />
            <input
              autoComplete="email"
              className="h-10 w-full border border-neutral-100 bg-slate-50 pl-9 pr-3 text-xs text-neutral-800 outline-none placeholder:text-neutral-400 transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              id="forgot-password-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || requestSent}
            className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 bg-cyan-600 px-4 text-xs font-medium text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && (
              <LoaderCircle
                aria-hidden="true"
                className="animate-spin"
                size={14}
              />
            )}
            {requestSent
              ? "Reset Link Requested"
              : isSubmitting
                ? "Sending..."
                : "Send Reset Link"}
          </button>

          <p className="mt-4 border-t border-neutral-100 pt-4 text-center text-xs text-neutral-500">
            Remember your password?{" "}
            <Link
              className="font-medium text-cyan-700 hover:text-cyan-900"
              href="/signin"
            >
              Sign In
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
