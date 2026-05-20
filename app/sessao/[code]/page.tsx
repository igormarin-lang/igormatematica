import { PlayerSession } from "./PlayerSession";
import { sanitizeCode } from "@/lib/session";

export default async function SessionPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <PlayerSession code={sanitizeCode(code)} />;
}
