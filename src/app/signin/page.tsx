"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

export default function SigninPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const requestedCallback = new URLSearchParams(window.location.search).get(
      "callbackURL",
    );
    const callbackURL =
      requestedCallback?.startsWith("/") &&
      !requestedCallback.startsWith("//")
        ? requestedCallback
        : "/";
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const rememberMe = formData.get("rememberMe") === "on";
    setIsSubmitting(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
        callbackURL,
      });

      if (error) {
        throw new Error(error.message || "Check your email and password.");
      }

      if (!data) {
        throw new Error("Could not sign in. Please try again.");
      }

      toast.add({
        title: "Signed in",
        description: "Welcome back to Wanderlast!",
        type: "success",
      });
      router.replace(callbackURL);
    } catch (error) {
      toast.add({
        title: "Could not sign in",
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
            Welcome Back
          </h1>
          <p className="mt-1 text-[11px] text-neutral-500">
            Resume your adventure with Wanderlast
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="border border-neutral-100 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="space-y-3">
            <div>
              <label
                className="mb-1 block text-[11px] font-medium"
                htmlFor="signin-email"
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
                  id="signin-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="mb-1 block text-[11px] font-medium"
                htmlFor="signin-password"
              >
                Password
              </label>
              <div className="relative">
                <LockKeyhole
                  aria-hidden="true"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500"
                  size={13}
                />
                <input
                  autoComplete="current-password"
                  className="h-10 w-full border border-neutral-100 bg-slate-50 pl-9 pr-3 text-xs text-neutral-800 outline-none placeholder:text-neutral-400 transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  id="signin-password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px]">
            <label
              className="inline-flex cursor-pointer items-center gap-1.5 text-neutral-600"
              htmlFor="signin-remember-me"
            >
              <input
                className="size-3 accent-cyan-600"
                id="signin-remember-me"
                name="rememberMe"
                type="checkbox"
              />
              Remember me
            </label>
            <Link
              className="font-medium text-cyan-700 hover:text-cyan-900"
              href="/forgot-password"
            >
              Forgot password?
            </Link>
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
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>

          <p className="mt-3 border-t border-neutral-100 pt-4 text-center text-[11px] text-neutral-500">
            Don&apos;t have an account?{" "}
            <Link
              className="font-medium text-cyan-700 hover:text-cyan-900"
              href="/signup"
            >
              Create Account
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}