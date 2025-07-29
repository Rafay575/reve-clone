// components/AuthDialog.tsx
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  requestOtp,
  verifyOtp,
  completeSignup,
  login as apiLogin,
  forgotRequestOtp,
  forgotVerifyOtp,
  forgotReset,
} from "@/lib/authApi";
import { useRouter } from "next/navigation";

type AuthMode = "signup" | "signin";
type View = "signup" | "signin" | "forgot";
type SignUpStep = "email" | "otp" | "finish";
type ForgotStep = "email" | "otp" | "reset";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: AuthMode;
  onModeChange?: (mode: AuthMode) => void;
};

export function AuthDialog({
  open,
  onOpenChange,
  mode: controlledMode = "signup",
  onModeChange,
}: Props) {
  // ------- GLOBAL STATE
  const [view, setView] = React.useState<View>(controlledMode);
  const [signupStep, setSignupStep] = React.useState<SignUpStep>("email");
  const [forgotStep, setForgotStep] = React.useState<ForgotStep>("email");

  // shared fields (signup/signin)
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [agreePolicy, setAgreePolicy] = React.useState(false);
  const [isAdult, setIsAdult] = React.useState(false);

  const router = useRouter();

  // ---------- Loading flags ----------
  const [loading, setLoading] = React.useState({
    signupEmail: false,
    signupVerifyOtp: false,
    signupFinish: false,
    signin: false,
    google: false,
    forgotEmail: false,
    forgotOtp: false,
    forgotReset: false,
  });

  const setL = (key: keyof typeof loading, value: boolean) =>
    setLoading((s) => ({ ...s, [key]: value }));

  // keep in sync with parent
  React.useEffect(() => {
    setView(controlledMode);
    if (controlledMode === "signup") setSignupStep("email");
  }, [controlledMode]);

  const switchMode = (m: AuthMode) => {
    setView(m);
    onModeChange?.(m);
    if (m === "signup") setSignupStep("email");
  };

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.2 },
  };

  // ---------------- PASSWORD RULES
  function evaluatePassword(pw: string) {
    const hasMinLength = pw.length >= 12;
    const uniqueChars = new Set(pw).size >= 5;
    const noEdgeWhitespace = pw === pw.trim();
    return { hasMinLength, uniqueChars, noEdgeWhitespace };
  }

  // =========================================================
  // SIGN UP FLOW
  // =========================================================
  const onSignupEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setL("signupEmail", true);
    try {
      await requestOtp(email);
      toast.success("OTP sent to your email");
      setSignupStep("otp");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Could not send OTP");
    } finally {
      setL("signupEmail", false);
    }
  };

  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("Please enter 6 digits");
    setL("signupVerifyOtp", true);
    try {
      await verifyOtp(email, otp);
      toast.success("OTP verified");
      setSignupStep("finish");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Invalid OTP");
    } finally {
      setL("signupVerifyOtp", false);
    }
  };

  const onCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreePolicy || !isAdult) {
      return toast.error("Please accept the policy and confirm your age");
    }
    setL("signupFinish", true);
    try {
      await completeSignup(email, fullName, password);
      toast.success("Account created!");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Signup failed");
    } finally {
      setL("signupFinish", false);
    }
  };

  const onSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setL("signin", true);
    try {
      const res = await apiLogin(email, password);
      toast.success("Logged in!");
      onOpenChange(false);
      if (res.data.user.role === 1) router.replace("/admin");
      else router.replace("/create");
    } catch (err: any) {
      const code = err?.response?.data?.code;
      const user = err?.response?.data?.user;

      if (code === "BLOCKED") {
        toast.error(`Your account (${user?.email ?? email}) is blocked. Contact support.`);
      } else if (code === "DELETED") {
        toast.error(`Your account (${user?.email ?? email}) has been deleted.`);
      } else if (code === "GOOGLE_ONLY") {
        toast.error(
          `Your account (${user?.email ?? email}) uses Google sign in. Please continue with Google.`
        );
      } else {
        toast.error(err?.response?.data?.error || "Login failed");
      }
    } finally {
      setL("signin", false);
    }
  };

  // =========================================================
  // FORGOT PASSWORD (react-hook-form)
  // =========================================================
  type ForgotEmailForm = { email: string };
  type ForgotOtpForm = { otp: string };
  type ResetForm = { password: string; confirm: string };

  const forgotEmailForm = useForm<ForgotEmailForm>({
    defaultValues: { email: "" },
  });

  const forgotOtpForm = useForm<ForgotOtpForm>({
    defaultValues: { otp: "" },
  });

  const resetForm = useForm<ResetForm>({
    defaultValues: { password: "", confirm: "" },
  });

  const submitForgotEmail = async (data: ForgotEmailForm) => {
    setEmail(data.email);
    setL("forgotEmail", true);
    try {
      await forgotRequestOtp(data.email);
      toast.success("OTP sent to your email");
      setForgotStep("otp");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Could not send OTP");
    } finally {
      setL("forgotEmail", false);
    }
  };

  const submitForgotOtp = async (data: ForgotOtpForm) => {
    if (data.otp.length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setL("forgotOtp", true);
    try {
      await forgotVerifyOtp(email, data.otp);
      toast.success("OTP verified");
      setForgotStep("reset");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Invalid OTP");
    } finally {
      setL("forgotOtp", false);
    }
  };

  const submitReset = async (data: ResetForm) => {
    if (data.password !== data.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setL("forgotReset", true);
    try {
      await forgotReset(email, data.password);
      toast.success("Password changed!");
      onOpenChange(false);
      setView("signin");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to reset password");
    } finally {
      setL("forgotReset", false);
    }
  };

  const titleMap: Record<View, string> = {
    signup:
      signupStep === "email"
        ? "Welcome to Tivoa"
        : signupStep === "otp"
        ? "Verify your email"
        : "Finish setting up your account",
    signin: "Welcome back",
    forgot:
      forgotStep === "email"
        ? "Reset your password"
        : forgotStep === "otp"
        ? "Enter the code we emailed you"
        : "Choose a new password",
  };

  const GoogleButton: React.FC<{ label?: string }> = ({ label = "Sign in with Google" }) => (
    <Button
      type="button"
      variant="outline"
      disabled={loading.google}
      className="w-full justify-center gap-2 border-neutral-700 bg-transparent text-white hover:bg-slate-50"
      onClick={() => {
        setL("google", true);
        window.location.href = "http://localhost:4000/api/google";
      }}
    >
      {loading.google ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FcGoogle className="w-5 h-5" />
      )}
      {label}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-[#121212] text-white border border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            {titleMap[view]}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* ================= SIGN UP ================= */}
          {view === "signup" && (
            <>
              {signupStep === "email" && (
                <motion.div
                  key="signup-email"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={variants.transition}
                  variants={variants}
                  className="space-y-4"
                >
                  <GoogleButton label="Sign up with Google" />

                  <div className="relative flex items-center justify-center py-2">
                    <Separator className="bg-neutral-700" />
                    <span className="absolute bg-[#121212] px-2 text-sm text-neutral-400">
                      or
                    </span>
                  </div>

                  <form onSubmit={onSignupEmailSubmit} className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Email"
                      className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading.signupEmail}
                      required
                    />

                    <Button
                      type="submit"
                      disabled={loading.signupEmail}
                      className="w-full rounded-md bg-[linear-gradient(90deg,#9878A8,#9B96C1,#8CA388)] text-white font-medium hover:opacity-90 disabled:opacity-50"
                    >
                      {loading.signupEmail && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Sign up with email
                    </Button>

                    <p className="mt-2 text-center text-sm text-neutral-400">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("signin")}
                        className="bg-gradient-to-r from-[#A27790] via-[#9B96C1] to-[#8CA388] bg-clip-text text-transparent font-medium"
                      >
                        Log in
                      </button>
                    </p>
                  </form>
                </motion.div>
              )}

              {signupStep === "otp" && (
                <motion.div
                  key="signup-otp"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={variants.transition}
                  variants={variants}
                  className="space-y-4"
                >
                  <p className="text-center text-sm text-neutral-300">
                    We sent a 6‑digit code to{" "}
                    <span className="font-medium">{email}</span>
                  </p>

                  <form
                    onSubmit={onVerifyOtp}
                    className="space-y-4 flex justify-center flex-col items-center"
                  >
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(val) => setOtp(val)}
                      className="justify-center"
                      disabled={loading.signupVerifyOtp}
                    >
                      <InputOTPGroup>
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPSlot key={i} index={i} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>

                    <Button
                      type="submit"
                      disabled={otp.length !== 6 || loading.signupVerifyOtp}
                      className="w-full rounded-md bg-[linear-gradient(90deg,#9878A8,#9B96C1,#8CA388)] text-white font-medium hover:opacity-90 disabled:opacity-50"
                    >
                      {loading.signupVerifyOtp && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Verify code
                    </Button>

                    <p className="text-center text-xs text-neutral-500">
                      Didn’t get it?{" "}
                      <button
                        type="button"
                        className="underline"
                        onClick={() => toast.message("Resent (fake)")}
                      >
                        Resend code
                      </button>
                    </p>
                  </form>
                </motion.div>
              )}

              {signupStep === "finish" && (
                <motion.form
                  key="signup-finish"
                  onSubmit={onCreateAccount}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={variants.transition}
                  variants={variants}
                  className="space-y-4"
                >
                  <Input
                    value={email}
                    disabled
                    className="bg-neutral-900 border-neutral-700 text-neutral-400"
                  />

                  <Input
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500"
                    disabled={loading.signupFinish}
                    required
                  />

                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500"
                    disabled={loading.signupFinish}
                    required
                  />

                  {/* Live password tips */}
                  {(() => {
                    const { hasMinLength, uniqueChars, noEdgeWhitespace } =
                      evaluatePassword(password);

                    const Rule = ({
                      ok,
                      label,
                    }: {
                      ok: boolean;
                      label: React.ReactNode;
                    }) => (
                      <li className="flex items-center gap-2">
                        {ok ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={ok ? "text-green-500" : "text-neutral-400"}
                        >
                          {label}
                        </span>
                      </li>
                    );

                    return (
                      <ul className="text-xs space-y-1 mt-2">
                        <Rule ok={hasMinLength} label="At least 12 characters" />
                        <Rule ok={uniqueChars} label="At least 5 unique characters" />
                        <Rule
                          ok={noEdgeWhitespace}
                          label="No whitespace at beginning or end"
                        />
                      </ul>
                    );
                  })()}

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="policy"
                      checked={agreePolicy}
                      onCheckedChange={(v) => setAgreePolicy(Boolean(v))}
                      disabled={loading.signupFinish}
                    />
                    <Label
                      htmlFor="policy"
                      className="text-sm text-neutral-300 leading-relaxed inline"
                    >
                      I acknowledge the Tivoa AI{" "}
                      <Link href="/privacypolicy" className="underline">
                        Privacy Policy
                      </Link>{" "}
                      and agree to the Tivoa AI{" "}
                      <Link href="/termspage" className="underline">
                        Terms of Use
                      </Link>
                      .
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="adult"
                      checked={isAdult}
                      onCheckedChange={(v) => setIsAdult(Boolean(v))}
                      disabled={loading.signupFinish}
                    />
                    <Label htmlFor="adult" className="text-sm text-neutral-300">
                      I confirm that I am at least 18 years old.
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={!agreePolicy || !isAdult || loading.signupFinish}
                    className="w-full rounded-md bg-[linear-gradient(90deg,#9878A8,#9B96C1,#8CA388)] text-white font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    {loading.signupFinish && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create account
                  </Button>
                </motion.form>
              )}
            </>
          )}

          {/* ================= SIGN IN ================= */}
          {view === "signin" && (
            <motion.form
              key="signin"
              onSubmit={onSignin}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={variants.transition}
              variants={variants}
              className="space-y-3"
            >
              <GoogleButton label="Sign in with Google" />

              <div className="relative flex items-center justify-center py-2">
                <Separator className="bg-neutral-700" />
                <span className="absolute bg-[#121212] px-2 text-sm text-neutral-400">
                  or
                </span>
              </div>

              <Input
                type="email"
                placeholder="Email"
                className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading.signin}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading.signin}
                required
              />

              <p className="text-right text-xs text-neutral-500">
                <button
                  type="button"
                  className="underline"
                  onClick={() => {
                    setView("forgot");
                    setForgotStep("email");
                  }}
                  disabled={loading.signin}
                >
                  Forgot password?
                </button>
              </p>

              <Button
                type="submit"
                disabled={loading.signin}
                className="w-full rounded-md bg-[linear-gradient(90deg,#9878A8,#9B96C1,#8CA388)] text-white font-medium hover:opacity-90 disabled:opacity-50"
              >
                {loading.signin && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in with email
              </Button>

              <p className="mt-2 text-center text-sm text-neutral-400">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="bg-gradient-to-r from-[#A27790] via-[#9B96C1] to-[#8CA388] bg-clip-text text-transparent font-medium"
                >
                  Sign up
                </button>
              </p>
            </motion.form>
          )}

          {/* ================= FORGOT PASSWORD ================= */}
          {view === "forgot" && (
          <>
            {forgotStep === "email" && (
              <motion.form
                key="forgot-email"
                onSubmit={forgotEmailForm.handleSubmit(submitForgotEmail)}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={variants.transition}
                variants={variants}
                className="space-y-4"
              >
                <Input
                  type="email"
                  placeholder="Email"
                  className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500"
                  {...forgotEmailForm.register("email", { required: true })}
                  disabled={loading.forgotEmail}
                />

                <Button
                  type="submit"
                  disabled={loading.forgotEmail}
                  className="w-full rounded-md bg-[linear-gradient(90deg,#9878A8,#9B96C1,#8CA388)] text-white font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {loading.forgotEmail && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Send code
                </Button>

                <p className="mt-2 text-center text-sm text-neutral-400">
                  Remembered your password?{" "}
                  <button
                    type="button"
                    onClick={() => setView("signin")}
                    className="bg-gradient-to-r from-[#A27790] via-[#9B96C1] to-[#8CA388] bg-clip-text text-transparent font-medium"
                    disabled={loading.forgotEmail}
                  >
                    Log in
                  </button>
                </p>
              </motion.form>
            )}

            {forgotStep === "otp" && (
              <motion.form
                key="forgot-otp"
                onSubmit={forgotOtpForm.handleSubmit(submitForgotOtp)}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={variants.transition}
                variants={variants}
                className="space-y-4 flex justify-center flex-col items-center"
              >
                <p className="text-center text-sm text-neutral-300">
                  We sent a 6‑digit code to{" "}
                  <span className="font-medium">{email}</span>
                </p>

                <InputOTP
                  maxLength={6}
                  value={forgotOtpForm.watch("otp")}
                  onChange={(val) => forgotOtpForm.setValue("otp", val)}
                  className="justify-center mx-auto"
                  disabled={loading.forgotOtp}
                >
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                <Button
                  type="submit"
                  disabled={forgotOtpForm.watch("otp").length !== 6 || loading.forgotOtp}
                  className="w-full rounded-md bg-[linear-gradient(90deg,#9878A8,#9B96C1,#8CA388)] text-white font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {loading.forgotOtp && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Verify code
                </Button>

                <p className="text-center text-xs text-neutral-500">
                  Didn’t get it?{" "}
                  <button
                    type="button"
                    className="underline"
                    onClick={() => toast.message("Resent (fake)")}
                    disabled={loading.forgotOtp}
                  >
                    Resend code
                  </button>
                </p>
              </motion.form>
            )}

            {forgotStep === "reset" && (
              <motion.form
                key="forgot-reset"
                onSubmit={resetForm.handleSubmit(submitReset)}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={variants.transition}
                variants={variants}
                className="space-y-4"
              >
                <Input
                  type="password"
                  placeholder="New password"
                  className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500"
                  {...resetForm.register("password", { required: true })}
                  disabled={loading.forgotReset}
                />
                <Input
                  type="password"
                  placeholder="Confirm password"
                  className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500"
                  {...resetForm.register("confirm", { required: true })}
                  disabled={loading.forgotReset}
                />

                <Button
                  type="submit"
                  disabled={loading.forgotReset}
                  className="w-full rounded-md bg-[linear-gradient(90deg,#9878A8,#9B96C1,#8CA388)] text-white font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {loading.forgotReset && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Set new password
                </Button>
              </motion.form>
            )}
          </>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
