'use client'

import { authClient } from "@/lib/auth-client"
import { Button } from "./ui/button"

export default function LoginOutButton() {
  async function handleLogin() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => location.reload(),
      }
    })
  }
  return (
    <Button variant='link' onClick={handleLogin} className="cursor-pointer text-red-600 hover:text-red-700">
      Sair
    </Button>
  )
}