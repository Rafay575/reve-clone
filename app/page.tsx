import { cookies } from "next/headers";
import TivoaLanding from "@/components/TivoaLanding";

export default async function Page() {
  const cookieStore = await cookies(); // <- await
  const token = cookieStore.get("access_token")?.value ?? null;
  const user  = cookieStore.get("user")?.value ?? null;

  const isAuthed = Boolean(token && user);

  return <TivoaLanding isAuthed={isAuthed} />;
}
