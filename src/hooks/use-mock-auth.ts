"use client";

import { useState, useCallback } from "react";
import type { User, Role } from "@/types";

const MOCK_MEMBER: User = {
  id: "1",
  name: "Rahim Uddin",
  email: "rahim@example.com",
  role: "student",
  phone: "+880 1712-345678",
  bio: "Full-stack developer working with Node.js and React.",
};

const MOCK_ADMIN: User = {
  id: "admin-1",
  name: "WNM Admin",
  email: "admin@wnm.local",
  role: "admin",
};

export function useMockAuth() {
  const [user, setUser] = useState<User | null>(MOCK_MEMBER);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback((role: Role = "student") => {
    setIsLoading(true);
    setTimeout(() => {
      setUser(role === "admin" ? MOCK_ADMIN : MOCK_MEMBER);
      setIsLoading(false);
    }, 300);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchRole = useCallback((role: Role) => {
    setUser(role === "admin" ? MOCK_ADMIN : MOCK_MEMBER);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    logout,
    switchRole,
  };
}
