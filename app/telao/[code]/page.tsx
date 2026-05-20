import { BigScreenClient } from "./BigScreenClient";
import { sanitizeCode } from "@/lib/session";

export default async function BigScreenPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <BigScreenClient code={sanitizeCode(code)} />;
}
