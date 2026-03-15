import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, Clock3, Mic, SquarePen, Trash2, Zap } from "lucide-react"

import { NoteAudioPlayer } from "@/components/note-audio-player"
import { mockNotes } from "@/lib/mock-notes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Props = { params: Promise<{ id: string }> }

export default async function NoteDetailPage({ params }: Props) {
  const { id } = await params
  const note = mockNotes.find((item) => item.id === id)
  const duration = note?.time || "2:34"

  if (!note) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#D9D6CF] dark:bg-[#060A14]">
      <section className="mx-auto min-h-screen w-full max-w-sm bg-[#EAE8E2] dark:bg-[#0B1220]">
        <header className="border-b border-border/60 bg-[#F6F5F2] px-5 pb-4 pt-7 dark:bg-[#101522]">
          <div className="mb-4 flex items-center justify-between">
            <Link className="inline-flex items-center gap-1 text-sm text-[#656A88]" href="/notes">
              <ChevronLeft className="size-4" /> Notes
            </Link>
            <div className="flex items-center gap-2">
              <Link href={`/notes/${note.id}/edit`}>
                <Button className="size-9 rounded-xl border border-border bg-card text-[#7E829F]" size="icon" variant="outline">
                  <SquarePen className="size-4" strokeWidth={1.8} />
                </Button>
              </Link>
              <Button className="size-9 rounded-xl border border-border bg-card text-primary" size="icon" type="button" variant="outline">
                <Trash2 className="size-4" strokeWidth={1.8} />
              </Button>
            </div>
          </div>

          <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary hover:bg-primary/10">{note.tag}</Badge>

          <h1 className="mt-3 font-serif text-[1.38rem] font-bold leading-tight text-[#0B0B34] dark:text-[#FFF4E8]">{note.title}</h1>

          <div className="mt-2 flex items-center gap-3 text-xs text-[#9EA2C0]">
            <span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" /> {note.dayLabel}, 9:41 AM</span>
            <span className="inline-flex items-center gap-1"><Mic className="size-3.5" /> {duration}</span>
          </div>
        </header>

        <div className="space-y-4 px-5 py-5">
          <NoteAudioPlayer duration={duration} />

          <div className="rounded-3xl border border-primary/25 bg-primary/7 p-4">
            <p className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold tracking-[0.08em] text-primary">
              <Zap className="size-3.5" /> AI SUMMARY
            </p>
            <p className="text-[0.95rem] leading-[1.7] text-[#1C1D3A] dark:text-[#E8E3DA]">{note.description}</p>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold tracking-[0.08em] text-[#A1A4BF]">TRANSCRIPT</p>
            <p className="text-[0.95rem] leading-[1.8] text-[#1C1D3A] dark:text-[#E8E3DA]">
              Okay so I wanted to jot down a few ideas before the team sync tomorrow. First thing - we really need to nail the onboarding flow. I&apos;ve seen a huge drop-off in week two. Maybe we add a progress bar or a goal-setting prompt on day one.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
