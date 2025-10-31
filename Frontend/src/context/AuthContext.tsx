import React, { createContext, useState, useContext, ReactNode } from "react";
import API from "../api/axios";

interface User {
  id: string;
  fullName: string;
  email: string;
  instagramHandle?: string;
  brandName?: string;
}

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  brandName?: string;
  websiteOrInstagram?: string;
  industryOrNiche?: string;
  instagramHandle?: string;
  portfolioUrl?: string;
  followerCount?: string;
  averageViews?: string;
  totalInteractions?: string;
  newFollowersGained?: string;
  accountsReached?: string;
  niche?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (data: SignupData, role?: "creator" | "promoter") => Promise<void>;
  login: (email: string, password: string, role?: "creator" | "promoter") => Promise<void>;
  logout: (role?: "creator" | "promoter") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const signup = async (data: SignupData, role: "creator" | "promoter" = "creator") => {
    try {
      setLoading(true);
      const endpoint = role === "creator" ? "/creator/register" : "/promoter/register";
      const res = await API.post(endpoint, data);
      setUser(res.data.creator || res.data.promoter);
      console.log("✅ Signup Success:", res.data);
    } catch (err: any) {
      console.error("❌ Signup Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, role: "creator" | "promoter" = "creator") => {
    try {
      setLoading(true);
      const endpoint = role === "creator" ? "/creator/login" : "/promoter/login";
      const res = await API.post(endpoint, { email, password });
      setUser(res.data.creator || res.data.promoter);
      console.log("✅ Login Success:", res.data);
    } catch (err: any) {
      console.error("❌ Login Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (role: "creator" | "promoter" = "creator") => {
    try {
      const endpoint = role === "creator" ? "/creator/logout" : "/promoter/logout";
      await API.get(endpoint);
      setUser(null);
      console.log("🚪 Logout Success");
    } catch (err: any) {
      console.error("❌ Logout Error:", err.response?.data || err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for cleaner usage
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
