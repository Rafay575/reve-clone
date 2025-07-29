"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";

export default function PayWithBkash() {
  const [loading, setLoading] = useState(false);

  const startPayment = async () => {
    try {
      setLoading(true);
      const res = await api.post("/bkash/create", {
        amount: "100", // BDT
        invoice: `INV-${Date.now()}`,
      });
      const { bkashURL } = res.data;
      if (!bkashURL) throw new Error("No bKash URL returned");
      window.location.href = bkashURL;
    } catch (e: any) {
      toast.error(e.response?.data?.error || e.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={startPayment}
      disabled={loading}
      className="px-4 py-2 rounded bg-pink-600 text-white disabled:opacity-60"
    >
      {loading ? "Starting..." : "Pay with bKash (Sandbox)"}
    </button>
  );
}
