"use client"

import Link from "next/link"
import { useState } from "react"
import { Search, Zap } from "lucide-react"

import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { NoteListCard } from "@/components/note-list-card"
import { Input } from "@/components/ui/input"
import { mockNotes } from "@/lib/mock-notes"

const searchResults = mockNotes.filter(
  (note) => note.id === "react-query-caching" || note.id === "lex-consciousness"
)

export default function SearchPage() {
  const [mode, setMode] = useState("text")
  const semanticEnabled = mode === "semantic"

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
            />
          </div>

          <div className="flex rounded-xl bg-[#E2E0DB] p-1 dark:bg-[#161D30]">
            {["text", "semantic"].map((tab) => (
              <button
                key={tab}
                className={`flex-1 rounded-lg py-2 text-sm transition-all ${
                  mode === tab ? "bg-primary font-semibold text-white" : "text-[#5E627F]"
                }`}
                onClick={() => setMode(tab)}
                type="button"
              >
                {tab === "text" ? "🔤 Text" : "🧠 Semantic"}
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
          {searchResults.map((result) => (
            <Link className="block" href={`/notes/${result.id}`} key={result.id}>
              <NoteListCard
                dayLabel={result.dayLabel}
                tag={result.tag}
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
