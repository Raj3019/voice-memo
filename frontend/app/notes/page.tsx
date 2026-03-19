"use client"

import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"

import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { NoteListCard } from "@/components/note-list-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getNotes } from "@/lib/api/notes"
import { useRequireSession } from "@/lib/hooks/use-require-session"
import { buildNotePath } from "@/lib/note-route"
import type { Note } from "@/lib/types"

export default function NotesPage() {
  const { loading: sessionLoading, session } = useRequireSession()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    async function loadNotes() {
      try {
        const result = await getNotes({ limit: 50 })
        if (!active) return
        setNotes(result.data)
      } catch (err) {
        if (!active) return
        const message = err && typeof err === "object" && "message" in err ? String(err.message) : "Failed to load notes"
        setError(message)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    if (!sessionLoading) {
      void loadNotes()
    }

    return () => {
      active = false
    }
  }, [sessionLoading])

  const firstName = session?.user?.name?.trim()?.split(/\s+/)[0] || "there"

  return (
    <main className="min-h-screen bg-[#D9D6CF] dark:bg-[#060A14]">
      <section className="mx-auto min-h-screen w-full max-w-sm bg-[#EAE8E2] dark:bg-[#0B1220]">
        <div className="border-b border-border/60 bg-[#F6F5F2] px-5 pb-4 pt-7 dark:bg-[#101522]">
          {sessionLoading ? (
            <Skeleton className="mb-2 h-4 w-28 rounded-md" />
          ) : (
            <p className="mb-0.5 text-[13px] text-[#9A9DB8]">Welcome, {firstName}</p>
          )}
          <div className="mb-3 flex items-center justify-between">
            {sessionLoading ? (
              <Skeleton className="h-10 w-44 rounded-md" />
            ) : (
              <h1 className="font-serif text-3xl font-bold tracking-[-0.02em] text-[#0B0B34] dark:text-[#FFF4E8]">Memo Library</h1>
            )}
            <Link href="/search">
              <Button className="size-10 rounded-xl border border-border bg-card text-[#7E829F]" size="icon" type="button" variant="outline">
                <Search className="size-[17px]" />
              </Button>
            </Link>
          </div>

        </div>

        <div className="space-y-2.5 bg-[#EAE8E2] px-5 pb-24 pt-4 dark:bg-[#0B1220]">
          {loading ? (
            <Skeleton className="h-4 w-32 rounded-md" />
          ) : (
            <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#A1A4BF]">Recent - {notes.length} notes</p>
          )}
          {loading ? (
            <>
              <Skeleton className="h-28 w-full rounded-3xl" />
              <Skeleton className="h-28 w-full rounded-3xl" />
              <Skeleton className="h-28 w-full rounded-3xl" />
            </>
          ) : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {!loading && !error && notes.length === 0 ? <p className="text-sm text-[#9EA2C0]">No notes yet.</p> : null}
          {notes.map((note) => (
            <Link className="block" href={buildNotePath(note.slug)} key={note.id}>
              <NoteListCard
                dayLabel={note.dayLabel}
                tag={note.categoryName}
                time={note.time}
                title={note.title}
                voice={note.voice}
              />
            </Link>
          ))}
        </div>
      </section>

      <Link href="/notes/new">
        <Button
          className="fixed bottom-[5rem] right-[max(1rem,calc(50%-11rem))] size-[54px] rounded-full shadow-[0_8px_28px_rgba(224,122,95,0.35)]"
          size="icon"
        >
          <Plus className="size-6" strokeWidth={2.5} />
        </Button>
      </Link>

      <MobileBottomNav />
    </main>
  )
}
