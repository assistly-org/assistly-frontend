"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [otpCode, setOtpCode] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // ⚡ 1. Bring in googleLogin from Context
  const { googleLogin } = useAuth();

  // ⚡ 2. Initialize Google Auth cleanly
  useGoogleAuth(async (credential) => {
    setLocalError("");
    setIsLoading(true);
    try {
      await googleLogin(credential);
    } catch (err: any) {
      setLocalError(
        err.response?.data?.detail || "Google registration failed.",
      );
    } finally {
      setIsLoading(false);
    }
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setIsLoading(true);

    try {
      // ⚡ 3. Use the clean Service Layer
      const data = await AuthService.register({ email, password, name, phone });
      if (data?.message) {
        setShowOtp(true);
      }
    } catch (err: any) {
      setLocalError(err.response?.data?.detail || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setLocalError("");
    setIsLoading(true);

    try {
      // ⚡ 4. Use the clean Service Layer
      const data = await AuthService.verifyOtp(email, otpCode);

      localStorage.setItem("access_token", data.access_token);

      // ⚡ 5. Native Next.js Smart Routing
      if (data.requires_workspace_setup) {
        router.replace("/onboarding");
      } else {
        router.replace("/organizations");
      }
    } catch (err: any) {
      setLocalError(err.response?.data?.detail || "Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-500 rounded-lg mx-auto mb-4 flex items-center justify-center text-xl">
            ⚡
          </div>
          <h1 className="text-2xl font-bold">Assistly</h1>
          <p className="text-slate-400 text-sm mt-2">Create your account</p>
        </div>

        <div
          id="google-button-container"
          className="mb-6 flex justify-center w-full min-h-11"
        ></div>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-xs text-slate-500 uppercase font-semibold">
            Or Email
          </span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {localError && !showOtp && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
              {localError}
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Work Email</label>
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
            <label className="block mb-2 text-sm">
              Phone Number <span className="text-slate-500">(Optional)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="••••••••"
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
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
            {isLoading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>

      {showOtp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 p-8 rounded-xl w-full max-w-sm border border-slate-800">
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
              className="w-full px-4 py-4 rounded-lg bg-slate-950 border border-slate-700 text-center text-3xl tracking-[0.5em] font-mono mb-4 focus:outline-none"
            />
            <button
              onClick={handleVerify}
              disabled={isLoading || otpCode.length !== 6}
              className="w-full bg-indigo-600 py-3 rounded-lg font-semibold"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
