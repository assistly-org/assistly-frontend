"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // API call later
    setSuccess(true);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {!success ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
            <h1 className="text-2xl font-bold mb-2">Reset Password</h1>

            <p className="text-slate-400 mb-6">
              Enter your email address and send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm">Email Address</label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 py-3 rounded-lg font-semibold"
              >
                Send Reset Link
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-indigo-400">
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
            <div className="text-5xl mb-4">📧</div>

            <h2 className="text-2xl font-bold mb-3">Check your email</h2>

            <p className="text-slate-400">
               sent a password reset link to
            </p>

            <p className="font-semibold mt-2">{email}</p>

            <button
              onClick={() => setSuccess(false)}
              className="mt-6 w-full bg-slate-800 py-3 rounded-lg"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
