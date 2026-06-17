"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

declare global {
  interface Window {
    google: any;
  }
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isGoogleInitialized = useRef(false);

  const handleGoogleCallback = async (response: { credential: string }) => {
    setGoogleLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/google", {
        id_token: response.credential,
      });

      const data = res.data;

      if (data?.access_token) {
        localStorage.setItem("access_token", data.access_token);

        if (data.requires_workspace_setup) {
          window.location.replace("/onboarding"); 
        } else {
          window.location.replace("/organizations"); 
        }
      } else {
        setError(data?.message || "Google login failed.");
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(detail || "Failed to connect to the server.");
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkGoogle = setInterval(() => {
      if (window.google?.accounts?.id) {
        if (isGoogleInitialized.current) {
          clearInterval(checkGoogle);
          return;
        }

        isGoogleInitialized.current = true;
        clearInterval(checkGoogle);

        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: false,
          use_fedcm_for_prompt: true,
        });

        const buttonContainer = document.getElementById("google-button-container");
        if (buttonContainer) {
          window.google.accounts.id.renderButton(buttonContainer, {
            theme: "outline",
            size: "large",
            width: 300, // Fixed width
          });
        }

        // ⚡ THE FIX: Called completely empty. Let FedCM do its thing.
        window.google.accounts.id.prompt();
      }
    }, 100);

    return () => clearInterval(checkGoogle);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res.data;

      localStorage.setItem("access_token", data.access_token);

      if (data.requires_workspace_setup) {
        window.location.replace("/onboarding");
      } else {
        window.location.replace("/organizations");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to connect to the server.");
    } finally {
      setIsLoading(false);
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

        <div id="google-button-container" className="mb-6 flex justify-center w-full min-h-11"></div>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-slate-700" />
          <span className="text-xs text-slate-400 uppercase">Or Email</span>
          <div className="h-px flex-1 bg-slate-700" />
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
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
              <Link href="/auth/forgot-password" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
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
            disabled={isLoading || googleLoading}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${isLoading || googleLoading ? "bg-indigo-600/50 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"}`}
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400 text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Join Assistly
          </Link>
        </p>
      </div>
    </main>
  );
}