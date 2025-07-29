"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export default function BkashCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const paymentID = searchParams.get("paymentID");

    if (!paymentID) {
      toast.error("Missing paymentID");
      setStatus("error");
      return;
    }

    (async () => {
      try {
        const res = await api.post("/credits/execute", { paymentID });
        // res.data will contain trxID, transactionStatus, amount, etc.
        toast.success("Payment successful!");
        setStatus("success");
        // router.replace("/thank-you"); // if you want
      } catch (e: any) {
        toast.error(e.response?.data?.error || "Execute failed");
        setStatus("error");
      }
    })();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-black">
      {status === "loading" && <p>Finalizing your payment…</p>}
      {status === "success" && <p>Payment successful ✅</p>}
      {status === "error" && <p>Payment failed ❌</p>}
    </div>
  );
}
