"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/ui/Loader"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  // ⚡ 1. Pull the state directly from our secure memory Context
  const { isInitialized, accessToken } = useAuth(); 

  useEffect(() => {
    // ⚡ 2. The Logic: Only redirect IF we have finished checking the server 
    // AND we still don't have a token.
    if (isInitialized && !accessToken) {
      router.replace("/login");
    }
  }, [isInitialized, accessToken, router]);

  // ⚡ 3. The Loading State
  // While the app is silently asking the server for a refresh token, 
  // we show a cool loading screen instead of flashing the private dashboard.
  if (!isInitialized || !accessToken) {
    return <Loader fullScreen text="Securing workspace..." size="lg" />;
  }

  // ⚡ 4. If we have a token, unlock the gates and render the page!
  return <>{children}</>;
}