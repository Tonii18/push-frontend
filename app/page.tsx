"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/services/auth.service";

export default function Home() {

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {

      const data = await login({email, password});

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/home");

    } catch (error: any) {
      setErrorMessage(error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-1 bg-[#10140f] font-sans text-[#f3f6ef]">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col lg:flex-row">
        <aside className="relative flex flex-col justify-between overflow-hidden px-6 pt-8 sm:px-10 lg:w-[46%] lg:px-14 lg:py-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(198,241,53,0.16), transparent 42%), radial-gradient(circle at 80% 90%, rgba(198,241,53,0.08), transparent 36%)",
            }}
          />
          <div className="relative flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#c6f135] text-[#12160f]">
              <BarbellIcon />
            </span>
            <span className="text-sm font-semibold tracking-[0.28em]">PUSH</span>
          </div>

          <div className="relative mt-10 hidden lg:mt-0 lg:block">
            <p className="text-xs font-medium tracking-[0.22em] text-[#c6f135] uppercase">
              Gym routines
            </p>
            <h1 className="mt-3 max-w-sm text-4xl leading-[1.05] font-semibold tracking-tight">
              Write the session. Hit the numbers.
            </h1>
            <p className="mt-5 max-w-sm text-base leading-7 text-[#a7b0a2]">
              Keep every routine, set, and personal record in one place so the
              next workout starts where the last one ended.
            </p>
          </div>

          <ul className="relative mt-10 hidden gap-2 lg:mt-0 lg:grid">
            {[
              ["Routines", "Save the sessions you repeat."],
              ["Sets", "Log weight and reps as you train."],
              ["Progress", "Look back at what you lifted."],
            ].map(([title, detail]) => (
              <li
                key={title}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-1 text-sm text-[#a7b0a2]">{detail}</p>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex flex-1 items-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-semibold tracking-tight">Sign in</h2>
            <p className="mt-2 text-sm leading-6 text-[#a7b0a2]">
              Use the email tied to your training account.
            </p>

            {/* Error alert: It is showed up if errorMessage has content */}
            {errorMessage && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                {errorMessage}
              </div>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#0c100b] px-4 text-sm outline-none transition placeholder:text-[#6d7668] focus:border-[#c6f135] focus:ring-4 focus:ring-[#c6f135]/15"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-sm text-[#c6f135] transition hover:text-[#d8ff6a]"
                  >
                    Forgot password
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-white/10 bg-[#0c100b] px-4 pr-12 text-sm outline-none transition placeholder:text-[#6d7668] focus:border-[#c6f135] focus:ring-4 focus:ring-[#c6f135]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-[#a7b0a2] transition hover:text-white"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm text-[#c5cec0]">
                <input
                  type="checkbox"
                  name="remember"
                  className="size-4 rounded border-white/20 bg-[#0c100b] accent-[#c6f135]"
                />
                Keep me signed in on this device
              </label>

              <button
                type="submit"
                className="h-12 w-full rounded-xl bg-[#c6f135] text-sm font-semibold text-[#12160f] transition hover:bg-[#d4ff55] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c6f135]"
              >
                Sign in
              </button>
            </form>

            <p className="mt-8 text-sm text-[#a7b0a2]">
              New to Push?{" "}
              <Link
                href="/auth"
                className="font-medium text-[#f3f6ef] underline decoration-white/30 underline-offset-4 transition hover:decoration-[#c6f135]"
              >
                Create an account
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function BarbellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M2.2 7.2h2.1V5.4h1.7v9.2H4.3v-1.8H2.2V7.2Zm13.8 0h2V12h-2v2.6h-1.7V5.4h1.7v1.8ZM6.6 9.1h6.8v1.8H6.6V9.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M1.5 9S4.2 4.5 9 4.5 16.5 9 16.5 9 13.8 13.5 9 13.5 1.5 9 1.5 9Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="9" cy="9" r="2.1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M3 3.5 15 14.5M7.2 7.4A2.2 2.2 0 0 0 10.7 11M4.1 5.6C2.7 6.7 1.7 8.1 1.5 9c0 0 2.7 4.5 7.5 4.5 1.2 0 2.3-.3 3.2-.8M7.4 4.7c.5-.1 1-.2 1.6-.2 4.8 0 7.5 4.5 7.5 4.5-.4.7-1 1.4-1.7 2.1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
