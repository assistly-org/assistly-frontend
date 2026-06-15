"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

declare global {
  interface Window {
    google: any;
  }
}

export default function RegisterForm() {
  // --- Form States ---
  const [companyName, setCompanyName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- OTP States ---
  const [otpCode, setOtpCode] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  // --- Global UI States ---
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- Google Auth States ---
  const [showGoogleSetup, setShowGoogleSetup] = useState(false);
  const [setupToken, setSetupToken] = useState("");
  const [googleSubdomain, setGoogleSubdomain] = useState("");
  const [googleCompanyName, setGoogleCompanyName] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);


  // --- Google Handlers ---
  const handleGoogleCallback = async (response: { credential: string }) => {
    setGoogleLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/google", { id_token: response.credential });
      const data = res.data;

      if (data?.requires_setup) {
        setSetupToken(data.setup_token);
        setShowGoogleSetup(true);
      } else if (data?.access_token) {
        localStorage.setItem("access_token", data.access_token);
        window.location.replace("/organizations");
      } else {
        setError(data?.detail || "Google registration failed.");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to connect to the server.");
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/register", {
        email,
        password,
        company_name: companyName,
        subdomain,
      });

      if (response.data?.message) {
        setShowOtp(true);
      } else {
        setError(response.data?.detail || "Registration failed.");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/verify", { email, otp_code: otpCode });
      localStorage.setItem("access_token", response.data.access_token);
      window.location.replace("/organizations");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Verification failed.");
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
          <p className="text-slate-400 text-sm mt-2">Create your workspace</p>
        </div>

        <button type="button" onClick={handleGoogleLogin} disabled={googleLoading} className="w-full border border-slate-700 rounded-lg py-3 mb-6 hover:bg-slate-800 transition flex items-center justify-center gap-3 disabled:opacity-50">
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-slate-800" /><span className="text-xs text-slate-500 uppercase font-semibold">Or Email</span><div className="h-px flex-1 bg-slate-800" />
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {error && !showOtp && <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">{error}</div>}
          
          <div>
            <label className="block mb-2 text-sm">Business Name</label>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required placeholder="Acme Corp" className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-indigo-500 transition-colors" />
          </div>

          <div>
            <label className="block mb-2 text-sm">Workspace URL</label>
            <div className="flex">
              <input type="text" value={subdomain} onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} required placeholder="acme" className="flex-1 rounded-l-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-indigo-500 transition-colors" />
              <div className="px-4 flex items-center bg-slate-800 rounded-r-lg border border-slate-700 text-slate-400">.assistly.com</div>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm">Work Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@company.com" className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-indigo-500 transition-colors" />
          </div>

          <div>
            <label className="block mb-2 text-sm">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="••••••••" className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-indigo-500 transition-colors" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-200">{showPassword ? "🙈" : "👁️"}</button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-3 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-500 transition-all">
            {isLoading ? "Creating..." : "Create Workspace"}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400 text-sm">Already have an account? <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link></p>
      </div>

      {showOtp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 p-8 rounded-xl w-full max-w-sm border border-slate-800">
            <h3 className="text-2xl font-bold mb-2">Check your email</h3>
            <p className="text-slate-400 mb-6 text-sm">Enter the 6-digit OTP sent to <span className="text-white font-medium">{email}</span></p>
            <input type="text" maxLength={6} value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))} placeholder="000000" className="w-full px-4 py-4 rounded-lg bg-slate-950 border border-slate-700 text-center text-3xl tracking-[0.5em] font-mono mb-4 focus:outline-none" />
            <button onClick={handleVerify} disabled={isLoading || otpCode.length !== 6} className="w-full bg-indigo-600 py-3 rounded-lg font-semibold">{isLoading ? "Verifying..." : "Verify OTP"}</button>
          </div>
        </div>
      )}
    </main>
  );
}