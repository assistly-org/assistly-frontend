"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { getTenantSlugFromToken } from "@/lib/auth";

export default function RegisterPage() {
  // --- Form States ---
  const [plan, setPlan] = useState("trial");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [subdomain, setSubdomain] = useState("");

  // --- UI & Error States ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- OTP States ---
  const [otpCode, setOtpCode] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  // --- Google Auth States ---
  const [showGoogleSetup, setShowGoogleSetup] = useState(false);
  const [setupToken, setSetupToken] = useState("");
  const [googleSubdomain, setGoogleSubdomain] = useState("");
  const [googleCompanyName, setGoogleCompanyName] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    try {
      const tenantSlug = getTenantSlugFromToken(token);

      if (tenantSlug) {
        window.location.replace(`http://${tenantSlug}.localhost:3000/dashboard`);
        return;
      }
    } catch (error) {
      console.error("Token parsing error:", error);
    }

    window.location.replace("/dashboard");
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleGoogleCallback(response: any) {
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
        
        const tenantSlug = getTenantSlugFromToken(data.access_token);

        if (tenantSlug) {
          window.location.href = `http://${tenantSlug}.localhost:3000/dashboard`;
        } else {
          window.location.href = "/dashboard";
        }
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
  }

  // --- Initialize Google SDK ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    const interval = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (w.google?.accounts?.id) {
        w.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: handleGoogleCallback,
        });
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // --- Handlers ---

  function handleGoogleLogin() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (w.google?.accounts?.id) {
      w.google.accounts.id.prompt();
    } else {
      setError("Google SDK is still loading. Please try again in a moment.");
    }
  }

  async function handleGoogleSetup() {
    setLoading(true);
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

        const tenantSlug = getTenantSlugFromToken(data.access_token);

        if (tenantSlug) {
          window.location.href = `http://${tenantSlug}.localhost:3000/dashboard`;
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        setError(data?.detail || "Setup failed.");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Failed to complete workspace setup.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const trimmedEmail = email.trim();
    const trimmedCompanyName = companyName.trim();
    const cleanSubdomain = subdomain
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");

    if (!cleanSubdomain) {
      setError("Please enter a valid subdomain.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        email: trimmedEmail,
        password,
        company_name: trimmedCompanyName,
        subdomain: cleanSubdomain,
        plan_id: plan, 
      });

      if (response.data?.message) {
        setShowOtp(true);
      } else {
        setError(
          response.data?.detail ||
            "Registration failed. Please check your details.",
        );
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Failed to connect to the server.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/verify", {
        email: email.trim(),
        otp_code: otpCode,
      });

      const data = response.data;

      if (data?.access_token) {
        localStorage.setItem("access_token", data.access_token);

        const tenantSlug = getTenantSlugFromToken(data.access_token);

        if (tenantSlug) {
          window.location.href = `http://${tenantSlug}.localhost:3000/dashboard`;
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        setError(data?.detail || "Verification failed. Invalid OTP.");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex relative">
      {/* Left Side */}
      <section className="hidden lg:flex lg:w-1/2 border-r border-slate-800 p-12 flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assistly</h1>
        </div>
        <div>
          <h2 className="text-5xl font-bold leading-tight">
            The fastest AI workspace for technical teams.
          </h2>
          <p className="mt-6 text-slate-400">
            Join hundreds of teams optimizing AI workflows with Assistly.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-indigo-400 font-mono">1.2ms</p>
            <p className="text-slate-400 text-sm">Latent Response</p>
          </div>
          <div>
            <p className="text-indigo-400 font-mono">99.99%</p>
            <p className="text-slate-400 text-sm">Uptime SLA</p>
          </div>
        </div>
      </section>

      {/* Right Side */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">Create your workspace</h2>
          <p className="text-slate-400 mb-8">
            Join 500+ teams optimizing their AI workflows.
          </p>

          {/* Error Message Display */}
          {error && !showOtp && !showGoogleSetup && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Google Register */}
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
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
              Or Email
            </span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm text-slate-300">
                Business Name
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Corp"
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-300">
                Workspace URL
              </label>
              <div className="flex">
                <input
                  type="text"
                  required
                  value={subdomain}
                  onChange={(e) =>
                    setSubdomain(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                    )
                  }
                  placeholder="acme"
                  className="flex-1 px-4 py-3 rounded-l-lg bg-slate-900 border border-r-0 border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                />
                <div className="px-4 flex items-center bg-slate-800/50 rounded-r-lg border border-l-0 border-slate-800 text-slate-500">
                  .assistly.com
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-300">
                Work Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-300">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block mb-3 text-sm text-slate-300">
                Select Plan
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["trial", "starter", "growth"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPlan(item)}
                    className={`p-3 rounded-lg capitalize transition-all duration-200 font-medium ${
                      plan === item
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-500"
                        : "bg-slate-900/50 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-300"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 mt-4 rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Workspace..." : "Create Workspace"}
            </button>
          </form>
        </div>
      </section>

      {/* OTP Verification Modal */}
      {showOtp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 p-8 rounded-2xl w-full max-w-sm border border-slate-800 shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">Check your email</h3>
            <p className="text-slate-400 mb-6 text-sm">
              Enter the 6-digit OTP sent to{" "}
              <span className="text-white font-medium">{email}</span>
            </p>

            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full px-4 py-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-3xl tracking-[0.5em] font-mono mb-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-800 text-white"
            />

            {error && (
              <p className="text-red-400 text-sm mb-4 text-center bg-red-400/10 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              onClick={handleVerify}
              disabled={loading || otpCode.length !== 6}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              onClick={() => {
                setShowOtp(false);
                setError("");
              }}
              className="w-full mt-4 text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Google Setup Modal */}
      {showGoogleSetup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 p-8 rounded-2xl w-full max-w-sm border border-slate-800 shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">Almost there!</h3>
            <p className="text-slate-400 mb-6 text-sm">
              Set up your workspace to continue.
            </p>

            <div className="mb-5">
              <label className="block mb-2 text-sm text-slate-300">
                Business Name
              </label>
              <input
                type="text"
                value={googleCompanyName}
                onChange={(e) => setGoogleCompanyName(e.target.value)}
                placeholder="Acme Corp"
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-700"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm text-slate-300">
                Workspace URL
              </label>
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
                  className="flex-1 px-4 py-3 rounded-l-lg bg-slate-950 border border-r-0 border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-700"
                />
                <div className="px-4 flex items-center bg-slate-800/50 rounded-r-lg border border-l-0 border-slate-800 text-slate-500">
                  .assistly.com
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm mb-4 text-center bg-red-400/10 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              onClick={handleGoogleSetup}
              disabled={loading || !googleSubdomain || !googleCompanyName}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Setting up..." : "Create Workspace"}
            </button>

            <button
              onClick={() => {
                setShowGoogleSetup(false);
                setError("");
              }}
              className="w-full mt-4 text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}