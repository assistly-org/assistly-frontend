"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [plan, setPlan] = useState("trial");

  return (
    <main className="min-h-screen bg-slate-950 text-white flex">

      {/* Left Side */}

      <section className="hidden lg:flex lg:w-1/2 border-r border-slate-800 p-12 flex-col justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Assistly
          </h1>
        </div>

        <div>
          <h2 className="text-5xl font-bold leading-tight">
            The fastest AI workspace
            for technical teams.
          </h2>

          <p className="mt-6 text-slate-400">
            Join hundreds of teams optimizing
            AI workflows with Assistly.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-indigo-400 font-mono">
              1.2ms
            </p>
            <p className="text-slate-400 text-sm">
              Latent Response
            </p>
          </div>

          <div>
            <p className="text-indigo-400 font-mono">
              99.99%
            </p>
            <p className="text-slate-400 text-sm">
              Uptime SLA
            </p>
          </div>
        </div>

      </section>

      {/* Right Side */}

      <section className="w-full lg:w-1/2 flex items-center justify-center p-6">

        <div className="w-full max-w-md">

          <h2 className="text-3xl font-bold mb-2">
            Create your workspace
          </h2>

          <p className="text-slate-400 mb-8">
            Join 500+ teams optimizing their AI workflows.
          </p>

          <form className="space-y-5">

            <div>
              <label className="block mb-2 text-sm">
                Business Name
              </label>

              <input
                type="text"
                placeholder="Acme Corp"
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                Workspace URL
              </label>

              <div className="flex">
                <input
                  type="text"
                  placeholder="acme"
                  className="flex-1 px-4 py-3 rounded-l-lg bg-slate-900 border border-slate-700"
                />

                <div className="px-4 flex items-center bg-slate-800 rounded-r-lg border border-slate-700">
                  .assistly.com
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm">
                Work Email
              </label>

              <input
                type="email"
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                Password
              </label>

              <input
                type="password"
                placeholder="********"
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700"
              />
            </div>

            {/* Plan */}

            <div>
              <label className="block mb-3 text-sm">
                Select Plan
              </label>

              <div className="grid grid-cols-3 gap-2">

                <button
                  type="button"
                  onClick={() => setPlan("trial")}
                  className={`p-3 rounded-lg ${
                    plan === "trial"
                      ? "bg-indigo-600"
                      : "bg-slate-800"
                  }`}
                >
                  Trial
                </button>

                <button
                  type="button"
                  onClick={() => setPlan("starter")}
                  className={`p-3 rounded-lg ${
                    plan === "starter"
                      ? "bg-indigo-600"
                      : "bg-slate-800"
                  }`}
                >
                  Starter
                </button>

                <button
                  type="button"
                  onClick={() => setPlan("growth")}
                  className={`p-3 rounded-lg ${
                    plan === "growth"
                      ? "bg-indigo-600"
                      : "bg-slate-800"
                  }`}
                >
                  Growth
                </button>

              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 py-3 rounded-lg font-semibold"
            >
              Create Workspace
            </button>

          </form>

        </div>

      </section>

    </main>
  );
}