import { api } from "./axios";

export async function requestOtp(email: string) {
  return api.post("/request-otp", { email });
}

export async function verifyOtp(email: string, otp: string) {
  return api.post("/verify-otp", { email, otp });
}

export async function completeSignup(email: string, name: string, password: string) {
  return api.post("/complete", { email, name, password });
}

export async function login(email: string, password: string) {
  return api.post("/login", { email, password });
}

export async function forgotRequestOtp(email: string) {
  return api.post("/forgot/request-otp", { email });
}

export async function forgotVerifyOtp(email: string, otp: string) {
  return api.post("/forgot/verify-otp", { email, otp });
}

export async function forgotReset(email: string, newPassword: string) {
  return api.post("/forgot/reset", { email, newPassword });
}

// You can add refresh/logout/me if needed

export async function getUserMe() {
  return api.get("/me"); // Assumes token/cookie is sent with the request
}