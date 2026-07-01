"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { setAxiosToken } from "@/lib/api"; // ⚡ 1. Import the Axios bridge

interface User {
  id: string;
  email: string;
  name: string;
  tenant_subdomain: string;
}

interface AuthContextType {
  isLoading: boolean;
  isInitialized: boolean;
  accessToken: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  // Inside AuthProvider
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      // ⚡ THE FIX: Check for the local storage proxy first
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        // No user in storage? Skip the refresh API call entirely.
        if (isMounted) setIsInitialized(true);
        return;
      }

      try {
        // Only runs if we think the user MIGHT have a valid cookie
        const data = await AuthService.refreshToken();

        if (!isMounted) return;

        setAccessToken(data.access_token);
        setAxiosToken(data.access_token);
        setUser(JSON.parse(storedUser)); // We already verified it exists above

        setIsInitialized(true);
      } catch (error) {
        if (!isMounted) return;

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setAccessToken(null);
          setAxiosToken(null);
          setUser(null);
          localStorage.removeItem("user");
          setIsInitialized(true);
        } else {
          console.warn("Auth check interrupted.");
        }
      }
    };

    timeoutId = setTimeout(() => {
      initializeAuth();
    }, 320);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const handleAuthSuccess = (data: any) => {
    // ⚡ 4. Feed BOTH React memory AND Axios on successful login
    setAccessToken(data.access_token);
    setAxiosToken(data.access_token);

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.requires_workspace_setup) {
      router.replace("/onboarding");
    } else {
      router.replace("/organizations");
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await AuthService.loginWithEmail(email, password);
      handleAuthSuccess(data);
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (credential: string) => {
    setIsLoading(true);
    try {
      const data = await AuthService.loginWithGoogle(credential);
      handleAuthSuccess(data);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // ⚡ 5. Wipe BOTH React memory AND Axios on logout
    setAccessToken(null);
    setAxiosToken(null);
    setUser(null);
    localStorage.removeItem("user");

    try {
      await AuthService.logout();
    } finally {
      router.replace("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isInitialized,
        accessToken,
        user,
        login,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
