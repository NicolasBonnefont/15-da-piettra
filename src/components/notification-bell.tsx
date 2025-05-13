"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Bell } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getNotifications, getUnreadNotificationsCount, markNotificationsAsRead } from "@/app/(protected)/fotos/actions"

type Notification = {
  id: string
  type: string
  message: string
  read: boolean
  createdAt: Date
  photoId: string | null
  actor: {
    name: string | null
    image: string | null
  }
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  // Buscar notificações e contagem de não lidas
  useEffect(() => {
    async function fetchData() {
      try {
        const [notificationsData, count] = await Promise.all([getNotifications(), getUnreadNotificationsCount()])
        setNotifications(notificationsData)
        setUnreadCount(count)
      } catch (error) {
        console.error("Erro ao buscar notificações:", error)
      }
    }

    fetchData()

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Marcar notificações como lidas quando o popover é aberto
  useEffect(() => {
    if (open && unreadCount > 0) {
      markNotificationsAsRead().then(() => {
        setUnreadCount(0)
        setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
      })
    }
  }, [open, unreadCount])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors rounded-full hover:bg-pink-50">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-[10px] font-medium text-white ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 max-h-96 overflow-auto rounded-xl shadow-lg border-pink-100" align="end">
        <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-white">
          <h3 className="font-semibold text-lg text-pink-800">Notificações</h3>
        </div>

        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="h-10 w-10 mx-auto mb-2 text-gray-300" />
            <p>Você não tem notificações</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

function NotificationItem({ notification }: { notification: Notification }) {
  const isLike = notification.type === "like"

  return (
    <Link
      href={notification.photoId ? `/fotos` : "#"}
      className={cn(
        "flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors",
        !notification.read && "bg-pink-50",
      )}
    >
      <Avatar className="h-8 w-8 border border-pink-100">
        <AvatarImage src={notification.actor.image || ""} alt={notification.actor.name || "Usuário"} />
        <AvatarFallback className="bg-gradient-to-br from-pink-400 to-pink-600 text-white text-xs">
          {notification.actor.name?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-medium">{notification.actor.name}</span>{" "}
          {isLike ? "curtiu sua foto" : notification.message}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
            locale: ptBR,
          })}
        </p>
      </div>
      {!notification.read && <span className="h-2 w-2 rounded-full bg-pink-600 flex-shrink-0 mt-2"></span>}
    </Link>
  )
}
