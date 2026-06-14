"use client";

import { useEffect, useState } from "react";

export default function DashboardLayout() {
  const [subdomain, setSubdomain] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");
      
      // Parse the subdomain (e.g. "acme.localhost" -> "acme")
      if (parts.length >= 2 && parts[0] !== "www" && parts[0] !== "api") {
        setSubdomain(parts[0]);
      } else {
        setSubdomain("default");
      }

      // Read access token temporarily stored during verify
      const storedToken = localStorage.getItem("access_token");
      setToken(storedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex w-full">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Assistly
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono uppercase">
              {subdomain}
            </span>
          </div>

          <nav className="space-y-1">
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-indigo-600/10 text-indigo-400">
              Overview
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
              Agents
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
              Settings
            </a>
          </nav>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8">
          <h1 className="text-lg font-semibold">Workspace Overview</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400 font-mono">
              Schema: <span className="text-emerald-400">tenant_{subdomain}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Panels */}
        <section className="p-8 space-y-8 max-w-5xl">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-2">Welcome to your dashboard</h2>
            <p className="text-slate-400 text-sm">
              Your tenant schema was successfully provisioned on the backend. You are currently logged in.
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
              <p className="text-slate-400 text-sm">Active Agents</p>
              <p className="text-3xl font-mono font-bold mt-2 text-indigo-400">0</p>
              <p className="text-xs text-slate-500 mt-1">Phase 1 CRUD Pending</p>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
              <p className="text-slate-400 text-sm">Workspace Status</p>
              <p className="text-3xl font-mono font-bold text-emerald-400 mt-2">Active</p>
              <p className="text-xs text-slate-500 mt-1">Provisioning completed</p>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
              <p className="text-slate-400 text-sm">Session Type</p>
              <p className="text-xl font-bold mt-3 text-slate-300">
                {token ? "Authenticated" : "No Access Token"}
              </p>
              <p className="text-xs text-slate-500 mt-1">Bearer verification</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}