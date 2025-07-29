// lib/credits.ts
import { api } from "./axios";

export async function previewCredits(amountUSD: number) {
  const { data } = await api.post<{
    amountUSD: number;
    credits: number;
    message: string;
  }>("/credits/preview", { amountUSD });
  return data;
}

export async function initiateBkash(amountUSD: number) {
  const { data } = await api.post<{
    paymentID: string;
    bkashURL: string;
  }>("/credits/initiate", { amountUSD });
  return data;
}
