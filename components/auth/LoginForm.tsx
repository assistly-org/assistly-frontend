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

  const [showGoogleSetup, setShowGoogleSetup] = useState(false);
  const [setupToken, setSetupToken] = useState("");
  const [googleSubdomain, setGoogleSubdomain] = useState("");
  const [googleCompanyName, setGoogleCompanyName] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const isGoogleInitialized = useRef(false);

  const handleGoogleCallback = async (response: { credential: string }) => {
    setGoogleLoading(true);
    setError("");

    try {
      // ⚡ We are sending the 'id_token' again because One Tap generates JWTs
      const res = await api.post("/auth/google", {
        id_token: response.credential,
      });

      const data = res.data;

      if (data?.requires_setup) {
        setSetupToken(data.setup_token);
        setShowGoogleSetup(true);
      } else if (data?.access_token) {
        localStorage.setItem("access_token", data.access_token);
        window.location.replace("/organizations");
      } else {
        setError(data?.detail || "Google login failed.");
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(`Validation Error: ${detail[0].msg}`);
      } else {
        setError(detail || "Failed to connect to the server.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const interval = setInterval(() => {
      if (window.google?.accounts?.id && !isGoogleInitialized.current) {
        
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: handleGoogleCallback,
          auto_select: false, // Set to true if you want it to log them in without clicking!
          cancel_on_tap_outside: false, // Keeps the popup open if they click the background
        });

        // ⚡ 1. Render a fallback button in case they close the auto-popup
        const buttonContainer = document.getElementById("google-button-container");
        if (buttonContainer) {
          window.google.accounts.id.renderButton(buttonContainer, { 
            theme: "outline", 
            size: "large", 
            width: "100%" 
          });
        }

        // ⚡ 2. TRIGGER THE AUTO POPUP ON THE RIGHT SIDE
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log("One Tap was blocked by browser or closed by user.");
          }
        });

        isGoogleInitialized.current = true;
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleGoogleSetup = async () => {
    setIsLoading(true);
    setError("");
    const cleanSubdomain = googleSubdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");

    try {
      const res = await api.post("/auth/google/setup", {
        setup_token: setupToken,
        subdomain: cleanSubdomain,
        company_name: googleCompanyName.trim(),
      });

      if (res.data?.access_token) {
        localStorage.setItem("access_token", res.data.access_token);
        window.location.replace("/organizations");
      } else {
        setError(res.data?.detail || "Setup failed.");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to complete workspace setup.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("access_token", response.data.access_token);
      window.location.replace("/organizations");
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
          <div className="w-12 h-12 bg-indigo-500 rounded-lg mx-auto mb-4 flex items-center justify-center text-xl">⚡</div>
          <h1 className="text-2xl font-bold">Assistly</h1>
          <p className="text-slate-400 text-sm mt-2">Enterprise Access</p>
        </div>

        {/* Fallback button container */}
        <div id="google-button-container" className="mb-6 flex justify-center w-full min-h-11"></div>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-slate-700" />
          <span className="text-xs text-slate-400 uppercase">Or Email</span>
          <div className="h-px flex-1 bg-slate-700" />
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && !showGoogleSetup && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@company.com" className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-indigo-500 transition-colors" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm">Password</label>
              <Link href="/auth/forgot-password" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">Forgot?</Link>
            </div>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-indigo-500 transition-colors" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors">
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-slate-700 bg-slate-950 accent-indigo-500" />
            <label className="text-sm text-slate-300">Remember Me</label>
          </div>

          <button type="submit" disabled={isLoading || googleLoading} className={`w-full py-3 rounded-lg font-semibold transition-all ${isLoading || googleLoading ? "bg-indigo-600/50 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"}`}>
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400 text-sm">
          Don't have an account? <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Join Assistly</Link>
        </p>
      </div>

      {/* Google Setup Modal */}
      {showGoogleSetup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 p-8 rounded-xl w-full max-w-sm border border-slate-800 shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">Almost there!</h3>
            <p className="text-slate-400 mb-6 text-sm">Set up your workspace to continue.</p>

            <div className="mb-4">
              <label className="block mb-2 text-sm">Business Name</label>
              <input type="text" value={googleCompanyName} onChange={(e) => setGoogleCompanyName(e.target.value)} placeholder="Acme Corp" className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:border-indigo-500" />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm">Workspace URL</label>
              <div className="flex">
                <input type="text" value={googleSubdomain} onChange={(e) => setGoogleSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="acme" className="flex-1 rounded-l-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-indigo-500" />
                <div className="px-4 flex items-center bg-slate-800 rounded-r-lg border border-slate-700 text-slate-400">.assistly.com</div>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

            <button onClick={handleGoogleSetup} disabled={isLoading || !googleSubdomain || !googleCompanyName} className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50">
              {isLoading ? "Setting up..." : "Create Workspace"}
            </button>
            <button onClick={() => { setShowGoogleSetup(false); setError(""); }} className="w-full mt-4 text-slate-400 hover:text-white text-sm">Cancel</button>
          </div>
        </div>
      )}
    </main>
  );
}