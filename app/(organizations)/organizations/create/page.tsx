"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
// Import your TenantService here. Update the path if yours is different!
import { TenantService } from "@/services/tenant.service"; 

export default function CreateOrganizationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    company_name: "",
    subdomain: "",
    website_url: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Automatically generate a subdomain-friendly subdomain as they type the company name
    if (e.target.name === "company_name" && !formData.subdomain) {
      setFormData({
        ...formData,
        company_name: e.target.value,
        subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""),
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Using your clean TenantService instead of a raw fetch!
      await TenantService.CreateOrganization(formData);

      // Tell React Query the organizations list is stale so it refetches
      // next time it's read, instead of serving the cached (now outdated) list.
      await queryClient.invalidateQueries({ queryKey: ["organizations"] });

      // Success! Redirect back to the organizations list
      router.push("/organizations");
    } catch (err: any) {
      // If using Axios in your api.ts, the error message is usually inside err.response.data
      const errorMessage = err.response?.data?.detail || err.message || "Failed to create organization";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-[600px] mx-auto px-6 py-12">
      <div className="mb-8">
        <Link 
          href="/organizations" 
          className="text-sm text-slate-400 hover:text-white flex items-center gap-2 mb-4 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to organizations
        </Link>
        <h1 className="text-2xl font-semibold text-white">Create Organization</h1>
        <p className="text-slate-400 text-sm mt-1">Set up a new workspace for your team.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="company_name" className="block text-sm font-medium text-slate-300 mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              required
              value={formData.company_name}
              onChange={handleChange}
              placeholder="e.g. DineFlow"
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="subdomain" className="block text-sm font-medium text-slate-300 mb-1.5">
              Workspace Subdomain
            </label>
            <div className="flex">
              <input
                type="text"
                id="subdomain"
                name="subdomain"
                required
                value={formData.subdomain}
                onChange={handleChange}
                placeholder="dineflow"
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-l-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
              <span className="inline-flex items-center px-4 rounded-r-lg border border-l-0 border-slate-800 bg-slate-800/50 text-slate-400 text-sm">
                .assistly.com
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="website_url" className="block text-sm font-medium text-slate-300 mb-1.5">
              Website URL
            </label>
            <input
              type="url"
              id="website_url"
              name="website_url"
              required
              value={formData.website_url}
              onChange={handleChange}
              placeholder="https://dineflow.online"
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                "Create Organization"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}