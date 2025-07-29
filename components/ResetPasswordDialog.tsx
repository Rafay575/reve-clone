"use client";

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
export default function ResetPasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // Validation
  const passwordError = (() => {
    if (!currentPassword || !newPassword || !confirmPassword) return "All fields are required.";
    if (newPassword.length < 8) return "New password must be at least 8 characters.";
    if (newPassword !== confirmPassword) return "New passwords do not match.";
    if (newPassword === currentPassword) return "New password must be different from current.";
    return "";
  })();

 const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordError) {
      toast.error(passwordError);
      return;
    }
    setResetLoading(true);
    try {
      const res = await api.post("/auth/reset-password", {
        currentPassword,
        newPassword,
      });
      toast.success(res.data?.message || "Password reset successful!");
      onOpenChange(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error ||
        err?.message ||
        "Failed to reset password"
      );
    } finally {
      setResetLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#18181b] text-gray-100 max-w-md border border-gray-800">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter your current password and new password below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full rounded-md bg-[#232326] border border-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full rounded-md bg-[#232326] border border-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full rounded-md bg-[#232326] border border-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          {passwordError && (
            <div className="text-red-400 text-sm">{passwordError}</div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <button type="button" className="h-10 px-4 rounded-md border mr-2">
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              className="h-10 px-4 rounded-md bg-indigo-600 text-white disabled:opacity-50"
              disabled={!!passwordError || resetLoading}
            >
              {resetLoading ? "Resetting..." : "Reset"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
