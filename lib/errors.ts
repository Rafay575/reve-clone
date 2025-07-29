import { isAxiosError } from "axios";

export function getErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const data = err.response?.data;
    if (!data) return err.message;

    if (typeof data === "string") return data;

    // Common fields your API might return
    return (
      data.error ||
      data.message ||
      JSON.stringify(data) ||
      err.message ||
      "Something went wrong"
    );
  }

  if (err instanceof Error) return err.message;

  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}
