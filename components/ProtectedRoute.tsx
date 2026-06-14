"use client";

import { useEffect, useState } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // Dynamically calculate the public auth URL to avoid hardcoded localhost
    // and prevent Google OAuth origin mismatch errors on tenant subdomains.
    const getAuthUrl = () => {
      const isLocal = window.location.host.includes("localhost");
      const baseHost = isLocal
        ? "localhost:3000"
        : window.location.host.split(".").slice(-2).join(".");
      return `http://${baseHost}/auth/login`;
    };

    // 1. Check if token exists
    if (!token) {
      window.location.replace(getAuthUrl());
      return;
    }

    try {
      // 2. Decode the JWT payload safely
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);

      // 3. Check for token expiration
      if (payload.exp && payload.exp < now) {
        localStorage.removeItem("access_token");
        window.location.replace(getAuthUrl());
        return;
      }
    } catch (error) {
      // 4. Catch garbage data (e.g., manually edited localStorage)
      localStorage.removeItem("access_token");
      window.location.replace(getAuthUrl());
      return;
    }

    // Token is present, valid JSON, and not expired
    setChecking(false);

    // 5. Cross-tab logout sync
    const syncLogout = (event: StorageEvent) => {
      if (event.key === "access_token" && event.newValue === null) {
        window.location.replace(getAuthUrl());
      }
    };

    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-mono tracking-widest uppercase">
            Verifying Access
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}