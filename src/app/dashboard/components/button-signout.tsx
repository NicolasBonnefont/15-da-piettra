'use client'

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function ButtonSignOut() {
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push('/'),
        
      }
    })
  }

  return (
    <Button onClick={handleSignOut} variant='destructive'>Sair</Button>
  )
}