"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/ui/Loader";

export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  // ⚡ 1. Pull the state from our secure memory Context
  const { isInitialized, accessToken } = useAuth(); 

  useEffect(() => {
    // ⚡ 2. The Logic: If we are initialized and we DO have a token,
    // they shouldn't be on the login page. Kick them to the dashboard.
    if (isInitialized && accessToken) {
      router.replace("/organizations");
    }
  }, [isInitialized, accessToken, router]);

  // ⚡ 3. Prevent the "Flash" 
  // While the app is checking the refresh token on boot, we return null 
  // (a blank screen) so they don't see a flash of the login form before being redirected.
  if (!isInitialized || accessToken) {
    return <Loader fullScreen text="loading..." size="lg" />;
  }

  // ⚡ 4. If they have no token, render the Login/Register form!
  return <>{children}</>;
}