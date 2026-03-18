"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronLeft, Plus } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { NoteListCard } from "@/components/note-list-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategories } from "@/lib/api/categories"
import { getNotes } from "@/lib/api/notes"
import { useRequireSession } from "@/lib/hooks/use-require-session"
import type { Category } from "@/lib/types"

export default function CategoryNotesPage() {
  const { loading: sessionLoading } = useRequireSession()
  const params = useParams<{ slug: string }>()
  const slug = useMemo(() => params?.slug || "", [params])

  const [category, setCategory] = useState<Category | null>(null)
  const [notes, setNotes] = useState<Awaited<ReturnType<typeof getNotes>>["data"]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const allCategories = await getCategories()
        const matched = allCategories.find((item) => item.slug === slug)

        if (!active) return

        if (!matched) {
          setError("Category not found")
          setCategory(null)
          setNotes([])
          return
        }

        setCategory(matched)

        const result = await getNotes({ categoryId: matched.id, limit: 100 })
        if (!active) return
        setNotes(result.data)
      } catch (err) {
        if (!active) return
        const message = err && typeof err === "object" && "message" in err ? String(err.message) : "Failed to load category notes"
        setError(message)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    if (!sessionLoading && slug) {
      void load()
    }

    return () => {
      active = false
    }
  }, [sessionLoading, slug])

  return (
    <main className="min-h-screen bg-[#D9D6CF] dark:bg-[#060A14]">
      <section className="mx-auto min-h-screen w-full max-w-sm bg-[#EAE8E2] dark:bg-[#0B1220]">
        <header className="border-b border-border/60 bg-[#F6F5F2] px-5 pb-4 pt-7 dark:bg-[#101522]">
          <div className="mb-3 flex items-center justify-between">
            <Link className="inline-flex items-center gap-1 text-sm text-[#656A88]" href="/categories">
              <ChevronLeft className="size-4" /> Categories
            </Link>
            <Link href="/notes/new">
              <Button className="size-9 rounded-2xl" size="icon" type="button">
                <Plus className="size-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <>
              <Skeleton className="h-10 w-40 rounded-md" />
              <Skeleton className="mt-2 h-4 w-20 rounded-md" />
            </>
          ) : (
            <>
              <h1 className="font-serif text-[1.8rem] font-bold text-[#0B0B34] dark:text-[#FFF4E8]">{category?.name || "Category"}</h1>
              <p className="mt-1 text-sm text-[#9EA2C0]">{notes.length} notes</p>
            </>
          )}
        </header>

        <div className="space-y-2.5 bg-[#EAE8E2] px-5 pb-24 pt-4 dark:bg-[#0B1220]">
          {loading ? (
            <>
              <Skeleton className="h-28 w-full rounded-3xl" />
              <Skeleton className="h-28 w-full rounded-3xl" />
              <Skeleton className="h-28 w-full rounded-3xl" />
            </>
          ) : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {!loading && !error && notes.length ? (
            notes.map((note) => (
              <Link className="block" href={`/notes/${note.id}`} key={note.id}>
                <NoteListCard
                  dayLabel={note.dayLabel}
                  tag={note.categoryName}
                  time={note.time}
                  title={note.title}
                  voice={note.voice}
                />
              </Link>
            ))
          ) : null}

          {!loading && !error && notes.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-4 text-center text-sm text-[#9EA2C0]">
              No notes in this category yet. Tap + to create one.
            </div>
          ) : null}
        </div>
      </section>

      <MobileBottomNav />
    </main>
  )
}
