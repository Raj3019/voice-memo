import Link from "next/link"

import { Mic, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const categories = ["Work", "Personal", "Learning", "Journal"]

export default function NewNotePage() {
  return (
    <main className="min-h-screen bg-[#D9D6CF] dark:bg-[#060A14]">
      <section className="mx-auto min-h-screen w-full max-w-sm bg-[#EAE8E2] dark:bg-[#0B1220]">
        <header className="flex items-center justify-between border-b border-border/60 bg-[#F6F5F2] px-5 pb-4 pt-7 dark:bg-[#101522]">
          <Link className="inline-flex items-center gap-1 text-sm text-[#656A88]" href="/notes">
            <X className="size-4" /> Cancel
          </Link>
          <h1 className="text-base font-semibold text-[#0B0B34] dark:text-[#FFF4E8]">New Note</h1>
          <Button className="h-9 rounded-full px-5 text-sm font-semibold text-white dark:text-white" size="sm" type="button">
            Save
          </Button>
        </header>

        <div className="space-y-5 px-5 py-5">
          <div className="space-y-2.5">
            <Label className="text-xs font-semibold tracking-[0.1em] text-[#A2A4C2]">TITLE</Label>
            <Input
              className="h-12 rounded-2xl border-[#D7D4CC] bg-[#EFEEE9] text-base font-serif placeholder:text-[#9DA1BE] dark:border-input dark:bg-[#161D30]"
              placeholder="Note title..."
            />
          </div>

          <div className="space-y-2.5">
            <Label className="text-xs font-semibold tracking-[0.1em] text-[#A2A4C2]">CATEGORY</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button
                  key={category}
                  className={`rounded-full px-[14px] py-[6px] text-[13px] ${
                    index === 0 ? "bg-primary font-semibold text-white" : "bg-muted text-[#6C708E]"
                  }`}
                  type="button"
                >
                  {category}
                </button>
              ))}
              <button className="rounded-full bg-muted px-[14px] py-[6px] text-[13px] text-[#6C708E]" type="button">
                + New
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            <Label className="text-xs font-semibold tracking-[0.1em] text-[#A2A4C2]">DESCRIPTION</Label>
            <Textarea
              className="min-h-40 rounded-2xl border-[#D7D4CC] bg-[#EFEEE9] text-base placeholder:text-[#9DA1BE] dark:border-input dark:bg-[#161D30]"
              placeholder="Start typing your note..."
            />
          </div>

          <Link href="/notes/audio">
            <Button className="h-12 w-full rounded-2xl border-[1.5px] border-dashed border-primary/45 bg-primary/10 text-[15px] font-medium text-primary hover:bg-primary/15" variant="outline">
              <Mic className="size-4" /> Attach voice memo
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
