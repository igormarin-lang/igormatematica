import { redirect } from "next/navigation";
import { isTeacherAuthenticated } from "@/lib/auth";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  if (!(await isTeacherAuthenticated())) {
    redirect("/professor/login");
  }

  return <DashboardClient />;
}
