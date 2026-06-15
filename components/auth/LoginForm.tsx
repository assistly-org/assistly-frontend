"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

declare global {
  interface Window {
    google: any;
  }
}

export default function LoginForm() {
  // --- Email Login States ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- Global UI States ---
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- Google Auth States ---
  const [showGoogleSetup, setShowGoogleSetup] = useState(false);
  const [setupToken, setSetupToken] = useState("");
  const [googleSubdomain, setGoogleSubdomain] = useState("");
  const [googleCompanyName, setGoogleCompanyName] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  // --- Check if already logged in ---
  // useEffect(() => {
  //   const token = localStorage.getItem("access_token");
  //   if (!token) return;

  //   try {
  //     const payload = JSON.parse(atob(token.split(".")[1]));
  //     const now = Math.floor(Date.now() / 1000);

  //     if (payload.exp && payload.exp < now) {
  //       localStorage.removeItem("access_token");
  //       return;
  //     }

  //     // If valid token exists, send them to select their organization
  //     window.location.replace("/organizations");
  //   } catch (error) {
  //     localStorage.removeItem("access_token");
  //   }
  // }, []);

  // --- Google Handlers ---
  const handleGoogleCallback = async (response: { credential: string }) => {
    setGoogleLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/google", {
        id_token: response.credential,
      });

      const data = res.data;

      if (data?.requires_setup) {
        setSetupToken(data.setup_token);
        setShowGoogleSetup(true);
      } else if (data?.access_token) {
        localStorage.setItem("access_token", data.access_token);
        // Instantly route to organizations page
        window.location.replace("/organizations");
      } else {
        setError(data?.detail || "Google login failed.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Failed to connect to the server.",
      );
    } finally {
      setGoogleLoading(false);
    }
  };
  // --- Initialize Google SDK ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: handleGoogleCallback,
        });
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);
  const handleGoogleLogin = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      setError("Google SDK is still loading. Please try again in a moment.");
    }
  };

  const handleGoogleSetup = async () => {
    setIsLoading(true);
    setError("");

    const cleanSubdomain = googleSubdomain
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");

    try {
      const res = await api.post("/auth/google/setup", {
        setup_token: setupToken,
        subdomain: cleanSubdomain,
        company_name: googleCompanyName.trim(),
      });

      const data = res.data;

      if (data?.access_token) {
        localStorage.setItem("access_token", data.access_token);
        // Instantly route to organizations page
        window.location.replace("/organizations");
      } else {
        setError(data?.detail || "Setup failed.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Failed to complete workspace setup.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- Email Login Handler ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: email,
        password: password,
      });

      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);

      // Instantly route to organizations page
      window.location.replace("/organizations");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Failed to connect to the server.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-500 rounded-lg mx-auto mb-4 flex items-center justify-center text-xl">
            ⚡
          </div>
          <h1 className="text-2xl font-bold">Assistly</h1>
          <p className="text-slate-400 text-sm mt-2">Enterprise Access</p>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full border border-slate-700 rounded-lg py-3 mb-6 hover:bg-slate-800 transition flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {googleLoading ? "Connecting..." : "Sign in with Google"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-slate-700" />
          <span className="text-xs text-slate-400 uppercase">Or Email</span>
          <div className="h-px flex-1 bg-slate-700" />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Error Message Display */}
          {error && !showGoogleSetup && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
              {error}
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
                href="/auth/forgot-password"
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded border-slate-700 bg-slate-950 accent-indigo-500"
            />
            <label className="text-sm text-slate-300">Remember Me</label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              isLoading
                ? "bg-indigo-600/50 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
            }`}
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400 text-sm">
          Dont have an account?{" "}
          <Link
            href="/register"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Join Assistly
          </Link>
        </p>
      </div>

      {/* Google Setup Modal */}
      {showGoogleSetup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 p-8 rounded-xl w-full max-w-sm border border-slate-800 shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">Almost there!</h3>
            <p className="text-slate-400 mb-6 text-sm">
              Set up your workspace to continue.
            </p>

            <div className="mb-4">
              <label className="block mb-2 text-sm">Business Name</label>
              <input
                type="text"
                value={googleCompanyName}
                onChange={(e) => setGoogleCompanyName(e.target.value)}
                placeholder="Acme Corp"
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm">Workspace URL</label>
              <div className="flex">
                <input
                  type="text"
                  value={googleSubdomain}
                  onChange={(e) =>
                    setGoogleSubdomain(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                    )
                  }
                  placeholder="acme"
                  className="flex-1 rounded-l-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-indigo-500"
                />
                <div className="px-4 flex items-center bg-slate-800 rounded-r-lg border border-slate-700 text-slate-400">
                  .assistly.com
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
            )}

            <button
              onClick={handleGoogleSetup}
              disabled={isLoading || !googleSubdomain || !googleCompanyName}
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {isLoading ? "Setting up..." : "Create Workspace"}
            </button>
            <button
              onClick={() => {
                setShowGoogleSetup(false);
                setError("");
              }}
              className="w-full mt-4 text-slate-400 hover:text-white text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
