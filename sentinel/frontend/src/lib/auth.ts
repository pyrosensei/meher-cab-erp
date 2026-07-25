"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sentinel_token");
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("sentinel_token", token);
  }
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("sentinel_token");
  }
}

export function useAuth() {
  const router = useRouter();
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = getToken();
    setTokenState(t);
    setIsLoaded(true);
    
    // Redirect if no token is found on protected routes.
    // In a real app we might do this via middleware, but client-side is 
    // sufficient for this demo.
    if (!t && window.location.pathname.startsWith("/dashboard")) {
      router.push("/login");
    }
  }, [router]);

  return { token, isLoaded };
}
