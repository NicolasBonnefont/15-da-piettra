'use client'

import { authClient } from "@/lib/auth-client"
import { Button } from "./ui/button"

export default function SignInButton() {
  async function login() {
    await authClient.signIn.social({
      provider: "google"
    })
  }
  return (
    <Button onClick={login}>
      Fazer Login
    </Button>
  )
}