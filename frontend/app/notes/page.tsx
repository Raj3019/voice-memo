import Link from "next/link"
import { Plus, Search, Sun } from "lucide-react"

import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { NoteListCard } from "@/components/note-list-card"
import { Button } from "@/components/ui/button"
import { mockNotes } from "@/lib/mock-notes"

export default function NotesPage() {
  return (
    <main className="min-h-screen bg-[#D9D6CF] dark:bg-[#060A14]">
      <section className="mx-auto min-h-screen w-full max-w-sm bg-[#EAE8E2] dark:bg-[#0B1220]">
        <div className="border-b border-border/60 bg-[#F6F5F2] px-5 pb-4 pt-7 dark:bg-[#101522]">
          <p className="mb-0.5 flex items-center gap-1.5 text-[13px] text-[#9A9DB8]">
            Good morning <Sun className="size-3.5 fill-[#E07A5F] text-[#E07A5F]" />
          </p>
          <div className="mb-3 flex items-center justify-between">
            <h1 className="font-serif text-3xl font-bold tracking-[-0.02em] text-[#0B0B34] dark:text-[#FFF4E8]">Your Notes</h1>
            <Link href="/search">
              <Button className="size-10 rounded-xl border border-border bg-card text-[#7E829F]" size="icon" type="button" variant="outline">
                <Search className="size-[17px]" />
              </Button>
            </Link>
          </div>

        </div>

        <div className="space-y-2.5 bg-[#EAE8E2] px-5 pb-24 pt-4 dark:bg-[#0B1220]">
          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#A1A4BF]">Recent - {mockNotes.length} notes</p>
          {mockNotes.map((note) => (
            <Link className="block" href={`/notes/${note.id}`} key={note.id}>
              <NoteListCard
                dayLabel={note.dayLabel}
                tag={note.tag}
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
