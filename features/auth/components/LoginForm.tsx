"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext"; // ⚡ 1. Import our custom hook
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  // ⚡ 2. Pull the logic from Context! No more manual routing or API calls here.
  const { login, googleLogin, isLoading } = useAuth();

  // Initialize Google Auth Hook
  useGoogleAuth(async (credential) => {
    setLocalError("");
    try {
      await googleLogin(credential);
    } catch (err: any) {
      setLocalError(err.response?.data?.detail || "Google login failed.");
    }
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    try {
      await login(email, password);
    } catch (err: any) {
      setLocalError(
        err.response?.data?.detail || "Failed to connect to the server.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-500 rounded-lg mx-auto mb-4 flex items-center justify-center text-xl">
            ⚡
          </div>
          <h1 className="text-2xl font-bold">Assistly</h1>
          <p className="text-slate-400 text-sm mt-2">Enterprise Access</p>
        </div>

        <div
          id="google-button-container"
          className="mb-6 flex justify-center w-full min-h-11"
        ></div>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-slate-700" />
          <span className="text-xs text-slate-400 uppercase">Or Email</span>
          <div className="h-px flex-1 bg-slate-700" />
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {localError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
              {localError}
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@company.com"
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm">Password</label>
              <Link
                href="/forgot-password"
                className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${isLoading ? "bg-indigo-600/50 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"}`}
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400 text-sm">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Join Assistly
          </Link>
        </p>
      </div>
    </main>
  );
}
