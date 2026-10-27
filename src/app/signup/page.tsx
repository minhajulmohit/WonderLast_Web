"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

const inputClassName =
  "h-10 w-full border border-neutral-100 bg-slate-50 pl-9 pr-3 text-xs text-neutral-800 outline-none placeholder:text-neutral-400 transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500";

export default function SignupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";
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
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/signin",
      });

      if (error) {
        throw new Error(error.message || "Please check your details and retry.");
      }

      if (!data) {
        throw new Error("The account could not be created. Please try again.");
      }

      toast.add({
        title: "Account created",
        description: "Welcome to Wanderlast!",
        type: "success",
      });
      router.push("/signin");
    } catch (error) {
      toast.add({
        title: "Could not create account",
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
      <section className="w-full max-w-md">
        <header className="mb-5 text-center">
          <h1 className="font-(family-name:--font-display) text-3xl tracking-tight sm:text-4xl">
            Create Account
          </h1>
          <p className="mt-1 text-xs text-neutral-500">
            Start your adventure with Wanderlast
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
                htmlFor="signup-name"
              >
                Full Name
              </label>
              <div className="relative">
                <UserRound
                  aria-hidden="true"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500"
                  size={13}
                />
                <input
                  autoComplete="name"
                  className={inputClassName}
                  id="signup-name"
                  name="name"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="mb-1 block text-[11px] font-medium"
                htmlFor="signup-email"
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
                  className={inputClassName}
                  id="signup-email"
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
                htmlFor="signup-password"
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
                  autoComplete="new-password"
                  className={inputClassName}
                  id="signup-password"
                  name="password"
                  type="password"
                  minLength={8}
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="mb-1 block text-[11px] font-medium"
                htmlFor="signup-confirm-password"
              >
                Confirm Password
              </label>
              <div className="relative">
                <LockKeyhole
                  aria-hidden="true"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500"
                  size={13}
                />
                <input
                  autoComplete="new-password"
                  className={inputClassName}
                  id="signup-confirm-password"
                  name="confirmPassword"
                  type="password"
                  minLength={8}
                  placeholder="Confirm your password"
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
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>

          <p className="mt-4 border-t border-neutral-100 pt-4 text-center text-xs text-neutral-500">
            Already have an account?{" "}
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
