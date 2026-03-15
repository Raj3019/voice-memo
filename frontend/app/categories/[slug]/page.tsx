import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, Plus } from "lucide-react"

import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { NoteListCard } from "@/components/note-list-card"
import { Button } from "@/components/ui/button"
import { getCategoryBySlug } from "@/lib/mock-categories"
import { mockNotes } from "@/lib/mock-notes"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function CategoryNotesPage({ params }: Props) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const categoryNotes = mockNotes.filter((note) => note.tag.toLowerCase() === category.name.toLowerCase())

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

          <h1 className="font-serif text-[1.8rem] font-bold text-[#0B0B34] dark:text-[#FFF4E8]">{category.name}</h1>
          <p className="mt-1 text-sm text-[#9EA2C0]">{categoryNotes.length} notes</p>
        </header>

        <div className="space-y-2.5 bg-[#EAE8E2] px-5 pb-24 pt-4 dark:bg-[#0B1220]">
          {categoryNotes.length ? (
            categoryNotes.map((note) => (
              <Link className="block" href={`/notes/${note.id}`} key={note.id}>
                <NoteListCard
                  dayLabel={note.dayLabel}
                  tag={note.tag}
                  time={note.time}
                  title={note.title}
                  voice={note.voice}
                />
              </Link>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-4 text-center text-sm text-[#9EA2C0]">
              No notes in this category yet. Tap + to create one.
            </div>
          )}
        </div>
      </section>

      <MobileBottomNav />
    </main>
  )
}
