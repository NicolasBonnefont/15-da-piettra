import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import getSession from "@/lib/get-session"
import { cn } from "@/lib/utils"
import { Camera, Heart, MessageSquare } from "lucide-react"
import { Playfair_Display } from "next/font/google"
import Link from "next/link"
import { LoginButton } from "./login-button"
import LoginOutButton from "./loginout"
import { NotificationBell } from "./notification-bell"

const playfair = Playfair_Display({ subsets: ["latin"] })

export async function Navbar() {
  const session = await getSession()

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-pink-100">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-1.5 rounded-lg">
            <Heart className="h-5 w-5" />
          </div>
          <span
            className={cn(
              playfair.className,
              "text-xl font-bold bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent",
            )}
          >
            Festa15
          </span>
        </Link>

        {session ? (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1">
              <Link href="/fotos">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full px-4 flex gap-2 items-center"
                >
                  <Camera className="h-4 w-4" />
                  <span>Galeria</span>
                </Button>
              </Link>
              <Link href="/mural">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full px-4 flex gap-2 items-center"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Mural</span>
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <NotificationBell />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center rounded-full overflow-hidden border border-pink-100 hover:border-pink-200 transition-all">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "Usuário"} />
                      <AvatarFallback className="bg-gradient-to-br from-pink-400 to-pink-600 text-white text-xs">
                        {session.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium text-gray-700 border-b border-gray-100 mb-1">
                    {session.user?.name || "Usuário"}
                  </div>

                  <div className="md:hidden">
                    <DropdownMenuItem asChild>
                      <Link href="/fotos" className="cursor-pointer flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        <span>Galeria</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/mural" className="cursor-pointer flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>Mural</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>

                  <DropdownMenuItem asChild>
                    <LoginOutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ) : (
          <LoginButton />
        )}
      </div>
    </header>
  )
}
