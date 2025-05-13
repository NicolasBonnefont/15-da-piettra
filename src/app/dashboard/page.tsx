import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ButtonSignOut from "./components/button-signout";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session) {
    redirect('/')
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <p>{session.user.name}</p>

      <ButtonSignOut />
    </div>
  );
}