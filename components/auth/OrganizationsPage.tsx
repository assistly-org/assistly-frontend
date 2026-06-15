"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

interface Organization {
  id: string | number;
  name: string;
  slug: string;
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          window.location.replace("/login");
          return;
        }

        // Validate token expiration before fetching
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
          localStorage.removeItem("access_token");
          window.location.replace("/login");
          return;
        }

        // Fetch the user's organizations from FastAPI
        const res = await api.get("/users/me/organizations");
        setOrganizations(res.data);
      } catch (err: any) {
        setError("Failed to load organizations. Please try logging in again.");
        if (err.response?.status === 401) {
          localStorage.removeItem("access_token");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.replace("/login");
  };
  const handleOrganizationSelect = (slug: string) => {
    const token = localStorage.getItem("access_token");

    // Execute the token handoff to the selected subdomain
    const isLocal = window.location.host.includes("localhost");
    const baseHost = isLocal
      ? "localhost:3000"
      : window.location.host.split(".").slice(-2).join(".");

    window.location.href = `http://${slug}.${baseHost}/dashboard?token=${token}`;
  };

  // Filter organizations based on search input
  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white text-sm shadow-sm shadow-indigo-500/20">
            ⚡
          </div>
          <span className="text-slate-600">/</span>
          <span className="text-sm font-medium text-slate-200">
            Organizations
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-400">
          <button className="hover:text-slate-100 transition-colors">
            Feedback
          </button>

          {/* Global Search Placeholder */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-xs">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Search...</span>
            <span className="ml-4 px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300">
              Ctrl K
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="hover:text-slate-100 transition-colors">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </button>
            <button className="hover:text-slate-100 transition-colors">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </button>
            {/* Profile Menu Wrapper */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center border border-slate-700 hover:border-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>

              {/* Invisible overlay to close the menu when clicking outside */}
              {showProfileMenu && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
              )}

              {/* The Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-slate-800">
                    <p className="text-sm text-slate-400">Signed in as</p>
                    {/* You can replace this with the actual user's email if you fetch it! */}
                    <p className="text-sm font-medium text-slate-200 truncate">
                      user@assistly.com
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      Account Settings
                    </Link>
                    <Link
                      href="/billing"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      Billing & Invoices
                    </Link>
                  </div>

                  <div className="border-t border-slate-800 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1000px] mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-white mb-8">
          Your Organizations
        </h1>

        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Search Input */}
          <div className="relative w-full max-w-[280px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for an organization"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-sm"
            />
          </div>

          {/* New Organization Button */}
          <Link href="/register">
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/20">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New organization
            </button>
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizations.length === 0 && !error ? (
            <div className="col-span-full p-8 border border-dashed border-slate-800 rounded-xl text-center bg-slate-900/30">
              <p className="text-slate-400 text-sm">
                No organizations found. Create one to get started.
              </p>
            </div>
          ) : filteredOrganizations.length === 0 ? (
            <div className="col-span-full p-8 border border-dashed border-slate-800 rounded-xl text-center bg-slate-900/30">
              <p className="text-slate-400 text-sm">
                No organizations match your search.
              </p>
            </div>
          ) : (
            filteredOrganizations.map((org) => (
              <button
                key={org.id}
                onClick={() => handleOrganizationSelect(org.slug)}
                className="group flex items-center gap-4 p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500 hover:bg-slate-800/80 transition-all text-left shadow-sm hover:shadow-md"
              >
                {/* Organization Initial Logo */}
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-colors flex-shrink-0">
                  {org.name.charAt(0).toUpperCase()}
                </div>

                {/* Organization Text */}
                <div className="overflow-hidden">
                  <h3 className="text-sm font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
                    {org.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    Free Plan · {org.slug}.assistly.com
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
