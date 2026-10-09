import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/dal";

// Reads the session cookie at request time — allowed to block.
export const instant = false;

export default async function DashboardPage() {
  const user = await requireUser();
  redirect(user.role === "admin" ? "/admin" : "/student");
}
