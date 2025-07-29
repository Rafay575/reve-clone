// lib/runware.ts
import { api } from "./axios";

export type AspectRatio =
  | "1:1"
  | "3:2"
  | "2:3"
  | "4:3"
  | "3:4"
  | "16:9"
  | "9:16";

export async function txt2img(payload: {
  prompt: string;
  aspectRatio: AspectRatio;
  numImages: number;
  enhance: boolean;
  seed: number | null;
}) {
  try {
    const { data } = await api.post<{
      images: Array<{
        imageURL: string;
        imageUUID?: string;
        taskUUID?: string;
        seed?: number;
      }>;
    }>("/runware/txt2img", payload);
    return data;
  } catch (err: any) {
    const e: any = new Error(err?.response?.data?.error || "txt2img failed");
    e.status = err?.response?.status;
    e.meta = err?.response?.data;
    throw e;
  }
}

export async function myImages() {
  try {
    const { data } = await api.get<{
      images: Array<{ id: number; imageURL: string; createdAt: string;  is_favorite: boolean;
  is_deleted: boolean; }>;
    }>("/runware/mine");
    return data;
  } catch (err: any) {
    const e: any = new Error(err?.response?.data?.error || "Failed to fetch images");
    e.status = err?.response?.status;
    throw e;
  }
}
export async function toggleFavorite(imageId: string, favorite: boolean) {
  await api.post(`/user-images/${imageId}/favorite`, { favorite });
}

export async function softDeleteImage(imageId: string) {
  await api.post(`/user-images/${imageId}/delete`);
}

