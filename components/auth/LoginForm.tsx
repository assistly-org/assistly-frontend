// app/auth/login/page.tsx (or components/auth/LoginForm.tsx)
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api"; // ⚡ Import your smart Axios client!

export default function LoginForm() {
  const router = useRouter();
  
  // 1. Add state for the form inputs and UI feedback
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 2. The core login function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop the page from refreshing
    setError("");
    setIsLoading(true);

    try {
      // ⚡ 3. Fire the request to FastAPI
      const response = await api.post("/auth/login", {
        email: email,
        password: password,
      });

      // 4. Extract the data and save the token
      const { access_token, user } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      // 5. Route them to their specific workspace!
      // If they own 'mobilemart', this sends them to http://mobilemart.localhost:3000/dashboard
      if (user.tenant_slug) {
        window.location.href = `http://${user.tenant_slug}.localhost:3000/dashboard`;
      } else {
        // Fallback just in case
        router.push("/dashboard");
      }
      
    } catch (err: any) {
      // Display the specific FastAPI error message (e.g. "Invalid credentials")
      setError(err.response?.data?.detail || "Failed to connect to the server.");
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

        {/* Google Login (Placeholder for now) */}
        <button className="w-full border border-slate-700 rounded-lg py-3 mb-6 hover:bg-slate-800 transition">
          Sign in with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-slate-700" />
          <span className="text-xs text-slate-400 uppercase">Or Email</span>
          <div className="h-px flex-1 bg-slate-700" />
        </div>

        {/* Form - ⚡ Wired up to handleLogin */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Error Message Display */}
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
              onChange={(e) => setEmail(e.target.value)} // ⚡ Update State
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
                onChange={(e) => setPassword(e.target.value)} // ⚡ Update State
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
            <input type="checkbox" className="rounded border-slate-700 bg-slate-950 accent-indigo-500" />
            <label className="text-sm text-slate-300">Remember Me</label>
          </div>

          <button
            type="submit"
            disabled={isLoading} // ⚡ Prevent double-clicking
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
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Join Assistly
          </Link>
        </p>
      </div>
    </main>
  );
}