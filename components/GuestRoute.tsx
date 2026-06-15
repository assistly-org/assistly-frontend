"use client";

import { useEffect, useState } from "react";

export default function GuestRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const path = window.location.pathname;

    // IF logged in, force them to organizations (unless they are already there)
    if (token && path !== "/organizations") {
      window.location.replace("/organizations");
    } else {
      // IF not logged in, just stop checking and show the page content!
      // DO NOT redirect to /login here, or you will create a loop.
      setIsChecking(false);
    }
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}