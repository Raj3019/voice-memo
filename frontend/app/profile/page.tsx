"use client"

import { ChevronRight, LogOut, Settings } from "lucide-react"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeToggle } from "@/components/theme-toggle"
import { signOutSession } from "@/lib/api/auth"
import { getCategories } from "@/lib/api/categories"
import { invalidateNotesCache } from "@/lib/api/notes"
import { getNotes } from "@/lib/api/notes"
import { clearSessionCache, useRequireSession } from "@/lib/hooks/use-require-session"
import { invalidateCategoryCache } from "@/lib/api/categories"

type SettingItemProps = {
  title: string
  subtitle: string
  icon: ReactNode
  highlight?: boolean
  action?: ReactNode
}

function SettingItem({ title, subtitle, icon, highlight = false, action }: SettingItemProps) {
  return (
    <Card
      size="sm"
      className={`flex-row items-center justify-between gap-3 rounded-3xl border px-4 py-3 ${
        highlight ? "border-primary/35 bg-primary/8" : "border-border/70 bg-card/80"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className={`inline-flex size-10 items-center justify-center rounded-xl ${highlight ? "bg-primary text-primary-foreground" : "bg-muted text-[#8488A6]"}`}>
          {icon}
        </span>
        <div className="min-w-0">
          <p className={`truncate text-[1.1rem] font-semibold leading-tight ${highlight ? "text-primary" : "text-[#111333] dark:text-[#F7EBDD]"}`}>{title}</p>
          <p className="text-[0.95rem] text-[#A2A5BE]">{subtitle}</p>
        </div>
      </div>
      <div className="shrink-0 self-center">
        {action || <ChevronRight className="size-4 text-[#A2A5BE]" />}
      </div>
    </Card>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const { session, loading: sessionLoading } = useRequireSession()

  const [image, setImage] = useState("")
  const [notesCount, setNotesCount] = useState(0)
  const [categoriesCount, setCategoriesCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const name = session?.user?.name || ""
  const email = session?.user?.email || ""

  useEffect(() => {
    setImage(session?.user?.image || "")
  }, [session?.user?.image])

  useEffect(() => {
    if (sessionLoading) return

    let active = true

    async function loadStats() {
      try {
        const [notesRes, categories] = await Promise.all([
          getNotes({ limit: 500 }),
          getCategories(),
        ])

        if (!active) return

        setNotesCount(notesRes.meta.total)
        setCategoriesCount(categories.length)
      } catch (err) {
        if (!active) return
        const message = err && typeof err === "object" && "message" in err ? String(err.message) : "Failed to load profile"
        setError(message)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadStats()

    return () => {
      active = false
    }
  }, [sessionLoading])

  const handleSignOut = async () => {
    try {
      await signOutSession()
      clearSessionCache()
      invalidateNotesCache()
      invalidateCategoryCache()
    } finally {
      router.push("/login")
    }
  }

  return (
    <main className="min-h-screen bg-[#D9D6CF] dark:bg-[#060A14]">
      <section className="mx-auto min-h-screen w-full max-w-sm bg-[#EAE8E2] dark:bg-[#0B1220]">
        <div className="border-b border-border/60 bg-[#F6F5F2] px-5 pb-4 pt-7 dark:bg-[#101522]">
          {sessionLoading ? (
            <div className="mb-5 flex items-center gap-4">
              <Skeleton className="size-14 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-44 rounded-md" />
                <Skeleton className="h-5 w-36 rounded-md" />
              </div>
            </div>
          ) : (
            <div className="mb-5 flex items-center gap-4">
              {image ? (
                <img
                  src={image}
                  alt={name || "Profile image"}
                  className="size-14 rounded-full object-cover"
                  onError={() => setImage("")}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex size-14 items-center justify-center rounded-full bg-[#D59544] text-3xl font-bold text-white">
                  {(name || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#0B0B34] dark:text-[#FFF4E8]">{name || "User"}</h1>
                <p className="text-base text-[#5C607E] dark:text-[#AAB0D2]">{email || "-"}</p>
              </div>
            </div>
          )}

          <Card className="grid grid-cols-3 rounded-3xl border-border/70">
            <div className="px-2 py-3 text-center">
              <div className="text-3xl font-bold text-[#101235] dark:text-[#F7EBDD]">
                {loading ? <Skeleton className="mx-auto h-8 w-8 rounded-md" /> : notesCount}
              </div>
              <p className="text-xs text-[#A1A4BF]">Notes</p>
            </div>
            <div className="border-x border-border/70 px-2 py-3 text-center">
              <div className="text-3xl font-bold text-[#101235] dark:text-[#F7EBDD]">
                {loading ? <Skeleton className="mx-auto h-8 w-8 rounded-md" /> : categoriesCount}
              </div>
              <p className="text-xs text-[#A1A4BF]">Categories</p>
            </div>
            <div className="px-2 py-3 text-center">
              <p className="text-2xl font-bold text-[#101235] dark:text-[#F7EBDD]">Live</p>
              <p className="text-xs text-[#A1A4BF]">Session</p>
            </div>
          </Card>
        </div>

        <div className="space-y-3 bg-[#EAE8E2] px-5 pb-24 pt-4 dark:bg-[#0B1220]">
          {sessionLoading ? (
            <Skeleton className="h-[86px] w-full rounded-3xl" />
          ) : (
            <SettingItem
              icon={<Settings className="size-5" />}
              subtitle="Choose light or dark mode"
              title="Appearance"
              action={<ThemeToggle />}
            />
          )}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <Button className="mt-2 h-12 w-full rounded-2xl border border-primary/35 bg-transparent text-primary hover:bg-primary/8" variant="outline" onClick={handleSignOut}>
            <LogOut className="size-4" /> Sign Out
          </Button>
        </div>
      </section>

      <MobileBottomNav />
    </main>
  )
}
