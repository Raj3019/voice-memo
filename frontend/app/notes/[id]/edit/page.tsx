import Link from "next/link"
import { notFound } from "next/navigation"
import { X } from "lucide-react"

import { mockNotes } from "@/lib/mock-notes"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const categories = ["Work", "Personal", "Learning", "Journal"]

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditNotePage({ params }: Props) {
  const { id } = await params
  const note = mockNotes.find((item) => item.id === id)

  if (!note) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#D9D6CF] dark:bg-[#060A14]">
      <section className="mx-auto min-h-screen w-full max-w-sm bg-[#EAE8E2] dark:bg-[#0B1220]">
        <header className="flex items-center justify-between border-b border-border/60 bg-[#F6F5F2] px-5 py-4 dark:bg-[#101522]">
          <Link className="inline-flex items-center gap-1 text-base text-[#656A88]" href={`/notes/${note.id}`}>
            <X className="size-4" /> Cancel
          </Link>
          <h1 className="font-serif text-xl font-bold text-[#0B0B34] dark:text-[#FFF4E8]">Edit Note</h1>
          <Button className="h-9 rounded-full px-5 text-sm font-semibold" size="sm" type="button">
            Save
          </Button>
        </header>

        <div className="space-y-5 px-5 py-5">
          <div className="space-y-2.5">
            <Label className="text-xs font-semibold tracking-[0.1em] text-[#A2A4C2]">TITLE</Label>
            <div className="rounded-2xl border border-primary bg-[#EFEEE9] px-4 py-3 dark:bg-[#161D30]">
              <p className="font-serif text-[1.1rem] leading-[1.45] text-[#0B0B34] dark:text-[#FFF4E8]">{note.title}</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <Label className="text-xs font-semibold tracking-[0.1em] text-[#A2A4C2]">CATEGORY</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  className="h-8 rounded-full px-4 text-sm"
                  size="sm"
                  type="button"
                  variant={note.tag === category ? "default" : "secondary"}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <Label className="text-xs font-semibold tracking-[0.1em] text-[#A2A4C2]">DESCRIPTION</Label>
            <div className="min-h-44 rounded-2xl border border-primary bg-[#EFEEE9] px-4 py-3 dark:bg-[#161D30]">
              <p className="text-lg leading-relaxed text-[#1C1D3A] dark:text-[#E8E3DA]">{note.description}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
