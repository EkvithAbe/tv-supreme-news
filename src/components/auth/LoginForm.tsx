"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";

import AnimatedBackground from "./AnimatedBackground";

type Props = {
  redirectTo?: string;
};

type LoginResponse = {
  success: boolean;
  error?: string;
  user?: {
    role: "ADMIN" | "EDITOR";
  };
};

function getDestination(
  role: "ADMIN" | "EDITOR",
  redirectTo?: string,
) {
  if (role === "EDITOR") {
    if (
      redirectTo?.startsWith("/admin/news") ||
      redirectTo?.startsWith("/admin/videos")
    ) {
      return redirectTo;
    }

    return "/admin/news";
  }

  return redirectTo || "/admin";
}

export default function LoginForm({
  redirectTo,
}: Props) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError(
        "Enter your email address and password.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data =
        (await response.json()) as LoginResponse;

      if (
        !response.ok ||
        !data.success ||
        !data.user
      ) {
        throw new Error(
          data.error ||
            "Unable to sign in.",
        );
      }

      router.replace(
        getDestination(
          data.user.role,
          redirectTo,
        ),
      );
      router.refresh();
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to sign in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#fbf8fb] px-4 py-24 text-slate-950">
      <AnimatedBackground />

      <div className="absolute left-5 top-5 z-10 flex items-center gap-2.5 sm:left-8 sm:top-7">
        <Image
          src="/logo.png"
          alt="TV Supreme"
          width={40}
          height={40}
          className="h-10 w-10 rounded-lg object-contain drop-shadow-[0_2px_5px_rgba(15,23,42,0.7)]"
        />
        <div>
          <p className="text-sm font-bold tracking-tight text-slate-950 drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
            TV SUPREME
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-700 drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
            Content management
          </p>
        </div>
      </div>

      <section className="relative z-10 w-full max-w-[420px] rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] sm:px-9 sm:py-10">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 shadow-sm">
            <LogIn size={21} strokeWidth={2} />
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
            Sign in to TV SUPREME
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Use your administrator or editor account to manage newsroom content.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-5"
        >
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
            >
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                placeholder="admin@supremenews.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="current-password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                placeholder="Enter your password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) => !current,
                  )
                }
                disabled={isSubmitting}
                className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && (
              <Loader2
                size={17}
                className="animate-spin"
              />
            )}
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
