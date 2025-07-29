"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/axios"; // your axios instance with withCredentials: true

export function useLogout(redirectTo: string = "/") {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const logout = async () => {
    try {
      setLoading(true);
      await api.post("/logout"); // cookies are sent automatically
      // If you also cached anything client-side, clear it here:
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      toast.success("Logged out");
      router.replace(redirectTo);
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? "Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
}
