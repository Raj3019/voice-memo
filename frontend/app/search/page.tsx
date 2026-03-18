"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Search, Zap } from "lucide-react"

import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { NoteListCard } from "@/components/note-list-card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategories } from "@/lib/api/categories"
import { searchNotes } from "@/lib/api/notes"
import { useRequireSession } from "@/lib/hooks/use-require-session"
import type { Note, SearchMode } from "@/lib/types"

export default function SearchPage() {
  useRequireSession()

  const [mode, setMode] = useState<SearchMode>("text")
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Note[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const semanticEnabled = mode === "semantic"

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setError("")
      return
    }

    const timer = setTimeout(() => {
      setLoading(true)
      setError("")

      void (async () => {
        try {
          const categories = await getCategories()
          const data = await searchNotes(trimmed, mode, categories)
          setResults(data)
        } catch (err) {
          const message = err && typeof err === "object" && "message" in err ? String(err.message) : "Search failed"
          setError(message)
        } finally {
          setLoading(false)
        }
      })()
    }, 400)

    return () => clearTimeout(timer)
  }, [mode, query])

  return (
    <main className="min-h-screen bg-[#D9D6CF] dark:bg-[#060A14]">
      <section className="mx-auto min-h-screen w-full max-w-sm bg-[#EAE8E2] dark:bg-[#0B1220]">
        <div className="border-b border-border/60 bg-[#F6F5F2] px-5 pb-5 pt-7 dark:bg-[#101522]">
          <h1 className="mb-4 font-serif text-[1.4rem] font-bold text-[#0B0B34] dark:text-[#FFF4E8]">Search</h1>

          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#A3A6BF]" />
            <Input
              className="h-11 rounded-2xl border-[#D7D4CC] bg-[#EFEEE9] pl-10 text-sm placeholder:text-[#A7AAC4] dark:border-input dark:bg-[#161D30]"
              placeholder="Search notes..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="flex rounded-xl bg-[#E2E0DB] p-1 dark:bg-[#161D30]">
            {(["text", "semantic"] as const).map((tab) => (
              <button
                key={tab}
                className={`flex-1 rounded-lg py-2 text-sm transition-all ${
                  mode === tab ? "bg-primary font-semibold text-white" : "text-[#5E627F]"
                }`}
                onClick={() => setMode(tab)}
                type="button"
              >
                {tab === "text" ? "Text" : "Semantic"}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 bg-[#EAE8E2] px-5 pb-24 pt-5 dark:bg-[#0B1220]">
          {semanticEnabled ? (
            <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-3 text-[12.5px] text-primary">
              <Zap className="size-4" />
              AI-powered search understands meaning, not just keywords
            </div>
          ) : null}

          <p className="text-xs font-semibold tracking-[0.12em] text-[#A1A4BF]">RESULTS</p>

          {loading ? (
            <>
              <Skeleton className="h-28 w-full rounded-3xl" />
              <Skeleton className="h-28 w-full rounded-3xl" />
              <Skeleton className="h-28 w-full rounded-3xl" />
            </>
          ) : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          {results.map((result) => (
            <Link className="block" href={`/notes/${result.id}`} key={result.id}>
              <NoteListCard
                dayLabel={result.dayLabel}
                tag={result.categoryName}
                time={result.time}
                title={result.title}
                voice={result.voice}
              />
            </Link>
          ))}
        </div>
      </section>

      <MobileBottomNav />
    </main>
  )
}
