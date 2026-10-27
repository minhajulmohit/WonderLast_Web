"use client";

import Link from "next/link";
import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle, LockKeyhole } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password")?.toString() ?? "";
    const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

    if (password !== confirmPassword) {
      toast.add({
        title: "Passwords do not match",
        description: "Check both password fields and try again.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        throw new Error(error.message || "Request a new reset link and try again.");
      }

      toast.add({
        title: "Password updated",
        description: "Sign in with your new password.",
        type: "success",
      });
      router.push("/signin");
    } catch (error) {
      toast.add({
        title: "Could not reset password",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full max-w-sm">
      <header className="mb-5 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Reset Password
        </h1>
        <p className="mt-1 text-[11px] text-neutral-500">
          Choose a new password for your account
        </p>
      </header>

      <div className="border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
        {!token ? (
          <div className="text-center">
            <p className="text-sm text-neutral-600">
              This reset link is missing or invalid.
            </p>
            <Link
              className="mt-4 inline-block text-xs font-medium text-cyan-700 hover:text-cyan-900"
              href="/forgot-password"
            >
              Request another reset link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div>
                <label
                  className="mb-1 block text-[11px] font-medium"
                  htmlFor="reset-password"
                >
                  New Password
                </label>
                <div className="relative">
                  <LockKeyhole
                    aria-hidden="true"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500"
                    size={13}
                  />
                  <input
                    autoComplete="new-password"
                    className="h-10 w-full border border-neutral-100 bg-slate-50 pl-9 pr-3 text-xs text-neutral-800 outline-none placeholder:text-neutral-400 transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    id="reset-password"
                    name="password"
                    type="password"
                    minLength={8}
                    placeholder="Create a new password"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  className="mb-1 block text-[11px] font-medium"
                  htmlFor="reset-confirm-password"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <LockKeyhole
                    aria-hidden="true"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500"
                    size={13}
                  />
                  <input
                    autoComplete="new-password"
                    className="h-10 w-full border border-neutral-100 bg-slate-50 pl-9 pr-3 text-xs text-neutral-800 outline-none placeholder:text-neutral-400 transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    id="reset-confirm-password"
                    name="confirmPassword"
                    type="password"
                    minLength={8}
                    placeholder="Confirm your new password"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 bg-cyan-600 px-4 text-xs font-medium text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && (
                <LoaderCircle
                  aria-hidden="true"
                  className="animate-spin"
                  size={14}
                />
              )}
              {isSubmitting ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense
      fallback={<div className="h-80 w-full max-w-sm animate-pulse bg-white" />}
    >
      <ResetPasswordFormContent />
    </Suspense>
  );
}
