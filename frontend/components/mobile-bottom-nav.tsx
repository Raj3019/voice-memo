"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentType } from "react"
import { Folder, House, Search, UserRound } from "lucide-react"

import { cn } from "@/lib/utils"

type NavItem = {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { href: "/notes", label: "Notes", icon: House },
  { href: "/search", label: "Search", icon: Search },
  { href: "/categories", label: "Categories", icon: Folder },
  { href: "/profile", label: "Profile", icon: UserRound },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  const isItemActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-sm -translate-x-1/2 border-x border-t border-border bg-[#F6F5F2] dark:bg-[#101522]">
      <div className="grid w-full grid-cols-4 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = isItemActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 text-xs font-medium text-[#A3A5BE] transition-colors dark:text-[#8D92B3]",
                isActive && "text-primary"
              )}
            >
              <Icon className="size-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
