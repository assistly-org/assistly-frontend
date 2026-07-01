"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { TenantService } from "@/services/tenant.service";

// 1. Updated interface to match the new JSON response perfectly
interface Organization {
  id: string;
  name: string;
  subdomain: string;
  status: string;
  plan_tier: string;
  is_active: boolean;
  website_url: string | null;
  owner_name: string | null;
  created_by: string;
  created_at: string;
  logo_url: string | null;
}

export default function OrganizationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: organizations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const res = await TenantService.GetallOrganizations();
      return res?.tenants ?? [];
    },
  });

  const error = isError ? "Failed to load organizations." : "";

  const handleOrganizationSelect = (subdomain: string) => {
    const isLocal = window.location.host.includes("localhost");
    const baseHost = isLocal
      ? "localhost:3000"
      : window.location.host.split(".").slice(-2).join(".");

    window.location.href = `http://${subdomain}.${baseHost}/dashboard`;
  };

  // 2. New handler specifically for the settings route
  const handleSettingsSelect = (e: React.MouseEvent, subdomain: string) => {
    e.stopPropagation(); // Prevents the card's main onClick from firing
    const isLocal = window.location.host.includes("localhost");
    const baseHost = isLocal
      ? "localhost:3000"
      : window.location.host.split(".").slice(-2).join(".");

    window.location.href = `http://${subdomain}.${baseHost}/settings`;
  };

  const filteredOrganizations = organizations.filter((org:Organization) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <main className="max-w-[1000px] mx-auto px-6 py-12">
        <div className="h-8 w-48 bg-slate-800 rounded animate-pulse mb-8"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="h-10 w-full max-w-[280px] bg-slate-800 rounded-lg animate-pulse"></div>
          <div className="h-10 w-40 bg-slate-800 rounded-lg animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-5 bg-slate-900 border border-slate-800 rounded-xl animate-pulse shadow-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-800 shrink-0"></div>
              <div className="flex-1 space-y-2.5">
                <div className="h-3.5 bg-slate-800 rounded w-3/4"></div>
                <div className="h-2.5 bg-slate-800 rounded w-1/2 mt-1"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1000px] mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold text-white mb-8">
        Your Organizations
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
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

        <Link href="/organizations/create">
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

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          filteredOrganizations.map((org:Organization) => (
            // Changed from <button> to <div> to allow for the nested settings button without HTML warnings
            <div
              key={org.id}
              onClick={() => handleOrganizationSelect(org.subdomain)}
              className="group flex flex-col p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500 hover:bg-slate-800/80 transition-all text-left shadow-sm hover:shadow-md cursor-pointer"
            >
              {/* Header: logo, name, subdomain, settings button */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-colors shrink-0 overflow-hidden">
                    {org.logo_url ? (
                      <img
                        src={org.logo_url}
                        alt={org.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      org.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h3 className="text-sm font-semibold text-slate-200 truncate group-hover:text-white transition-colors capitalize">
                      {org.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                      {org.subdomain}.assistly.com
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => handleSettingsSelect(e, org.subdomain)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-md transition-all shrink-0 focus:opacity-100"
                  title="Settings"
                  aria-label={`${org.name} Settings`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </button>
              </div>

              {/* Details: every field from the API response */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs mt-4 pt-4 border-t border-slate-800">
                <div>
                  <p className="text-slate-600 text-[10px] uppercase tracking-wider mb-0.5">Plan</p>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                    {org.plan_tier}
                  </span>
                </div>

                <div>
                  <p className="text-slate-600 text-[10px] uppercase tracking-wider mb-0.5">Status</p>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${
                      org.status === "active"
                        ? "text-emerald-400 bg-emerald-400/10"
                        : "text-amber-400 bg-amber-400/10"
                    }`}
                  >
                    {org.status}
                  </span>
                </div>

                <div>
                  <p className="text-slate-600 text-[10px] uppercase tracking-wider mb-0.5">Active</p>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${org.is_active ? "bg-emerald-400" : "bg-slate-600"}`}
                    ></span>
                    {org.is_active ? "Yes" : "No"}
                  </span>
                </div>

                <div>
                  <p className="text-slate-600 text-[10px] uppercase tracking-wider mb-0.5">Owner</p>
                  <p className="text-slate-300 truncate">{org.owner_name || "—"}</p>
                </div>

                <div>
                  <p className="text-slate-600 text-[10px] uppercase tracking-wider mb-0.5">Created</p>
                  <p className="text-slate-300 truncate">
                    {new Date(org.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-slate-600 text-[10px] uppercase tracking-wider mb-0.5">Created by</p>
                  <p className="text-slate-400 font-mono truncate" title={org.created_by}>
                    {org.created_by}
                  </p>
                </div>

                {org.website_url && (
                  <div className="col-span-2">
                    <p className="text-slate-600 text-[10px] uppercase tracking-wider mb-0.5">Website</p>
                    <a
                      href={org.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-indigo-400 hover:text-indigo-300 truncate block"
                    >
                      {org.website_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  </div>
                )}

                <div className="col-span-2">
                  <p className="text-slate-600 text-[10px] uppercase tracking-wider mb-0.5">ID</p>
                  <p className="text-slate-500 font-mono truncate" title={org.id}>
                    {org.id}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}