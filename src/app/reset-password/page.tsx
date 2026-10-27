import ResetPasswordForm from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-[calc(100vh-3rem)] items-center justify-center bg-slate-50 px-5 py-16 text-neutral-950 sm:py-20">
      <ResetPasswordForm />
    </main>
  );
}
