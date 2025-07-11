import getSession from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession()
  if (!session) {
    redirect('/')
  }
  return (
    <>
      {children}
    </>
  );
}
