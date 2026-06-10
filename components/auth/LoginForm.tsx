"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8">

        {/* Logo */}

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
            ⚡
          </div>

          <h1 className="text-2xl font-bold">
            Assistly
          </h1>

          <p className="text-slate-400 text-sm mt-2">
            Enterprise Access
          </p>
        </div>

        {/* Google Login */}

        <button className="w-full border border-slate-700 rounded-lg py-3 mb-6 hover:bg-slate-800 transition">
          Sign in with Google
        </button>

        {/* Divider */}

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-slate-700" />
          <span className="text-xs text-slate-400 uppercase">
            Or Email
          </span>
          <div className="h-px flex-1 bg-slate-700" />
        </div>

        {/* Form */}

        <form className="space-y-5">

          <div>
            <label className="block mb-2 text-sm">
              Email Address
            </label>

            <input
              type="email"
              placeholder="name@company.com"
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>

            <div className="flex justify-between mb-2">
              <label className="text-sm">
                Password
              </label>

              <Link
                href="/auth/forgot-password"
                className="text-indigo-400 text-sm"
              >
                Forgot?
              </Link>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-indigo-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-3"
              >
                👁️
              </button>
            </div>

          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" />
            <label>
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 py-3 rounded-lg font-semibold hover:bg-indigo-500"
          >
            Sign In
          </button>

        </form>

        <p className="text-center mt-6 text-slate-400">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="text-indigo-400"
          >
            Join Assistly
          </Link>
        </p>

      </div>

    </main>
  );
}