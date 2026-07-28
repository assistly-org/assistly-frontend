"use client";

import { useState, useEffect } from "react";
import { AuthService } from "@/services/auth.service";

// Define the shape of your profile response
interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  avatar_url: string | null;
  last_active_tenant_subdomain: string | null;
}

export function OrganizationNavbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the user profile when the navbar mounts
  useEffect(() => {
    // Define the async function inside
    const fetchProfile = async () => {
      try {
        const userData = await AuthService.getProfile();
        setProfile(userData);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Call the function
    fetchProfile();
  }, []); // Empty dependency array ensures this runs once

  const handleLogout = async () => {
    localStorage.removeItem("access_token");

    try {
      await AuthService.logout()
    } catch (e) {
      console.error("Logout API failed", e);
    }

    window.location.replace("/login");
  };

  // Helper to get the initial for the fallback avatar
  const getInitial = () => {
    if (profile?.name) return profile.name.charAt(0).toUpperCase();
    if (profile?.email) return profile.email.charAt(0).toUpperCase();
    return "?";
  };

  return (
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
          <div className="relative">
            {/* Profile Button */}
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-700 hover:border-slate-500 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all overflow-hidden bg-slate-800 shrink-0"
            >
              {isLoading ? (
                <div className="w-full h-full animate-pulse bg-slate-700"></div>
              ) : profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name || "User profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-slate-200 font-medium text-xs">
                  {getInitial()}
                </span>
              )}
            </button>

            {/* Click-away backdrop */}
            {showProfileMenu && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              />
            )}

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-slate-800">
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {profile?.name || "User"}
                  </p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {profile?.email || "Loading..."}
                  </p>
                </div>

                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    Preferences
                  </button>
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
  );
}
