import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useLogout } from "@/lib/useLogout"; // Adjust path as needed

export default function DeleteAccountDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { logout } = useLogout("/"); // Redirect to home after logout

  const handleDelete = async () => {
    if (!password) {
      toast.error("Password is required");
      return;
    }
    setLoading(true);
    try {
      await api.post("/account/delete", { password });
      toast.success("Your account was deleted.");
      setPassword("");
      onOpenChange(false);

      // Call logout here!
      setTimeout(() => logout(), 700); // Small delay to let toast show, optional
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || "Failed to delete account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#18181b] text-gray-100 max-w-md border border-gray-800">
        <DialogHeader>
          <DialogTitle>Confirm Account Deletion</DialogTitle>
          <DialogDescription>
            Please enter your password to <span className="font-bold text-red-400">permanently delete</span> your account. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleDelete();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-md bg-[#232326] border border-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button
                type="button"
                className="h-10 px-4 rounded-md border mr-2"
                disabled={loading}
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              className="h-10 px-4 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
