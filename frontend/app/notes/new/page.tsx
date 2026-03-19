"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Mic, X } from "lucide-react"

import { createNote } from "@/lib/api/notes"
import { getCategories } from "@/lib/api/categories"
import { useRequireSession } from "@/lib/hooks/use-require-session"
import type { Category } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function NewNotePage() {
  const router = useRouter()
  const { loading: sessionLoading } = useRequireSession()
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const data = await getCategories()
        if (!active) return
        setCategories(data)
      } catch (err) {
        if (!active) return
        const message = err && typeof err === "object" && "message" in err ? String(err.message) : "Failed to load categories"
        setError(message)
      }
    }

    if (!sessionLoading) {
      void load()
    }

    return () => {
      active = false
    }
  }, [sessionLoading])

  const handleSave = async () => {
    setSaving(true)
    setError("")

    try {
      await createNote({
        title,
        description,
        categoryId: selectedCategoryId,
      })
      router.push("/notes")
    } catch (err) {
      const message = err && typeof err === "object" && "message" in err ? String(err.message) : "Failed to create note"
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#D9D6CF] dark:bg-[#060A14]">
      <section className="mx-auto min-h-screen w-full max-w-sm bg-[#EAE8E2] dark:bg-[#0B1220]">
        <header className="flex items-center justify-between border-b border-border/60 bg-[#F6F5F2] px-5 pb-4 pt-7 dark:bg-[#101522]">
          <Link className="inline-flex items-center gap-1 text-sm text-[#656A88]" href="/notes">
            <X className="size-4" /> Cancel
          </Link>
          <h1 className="text-base font-semibold text-[#0B0B34] dark:text-[#FFF4E8]">New Note</h1>
          <Button className="h-9 rounded-full px-5 text-sm font-semibold text-white dark:text-white" size="sm" type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </header>

        <div className="space-y-5 px-5 py-5">
          <div className="space-y-2.5">
            <Label className="text-xs font-semibold tracking-[0.1em] text-[#A2A4C2]">TITLE</Label>
            <Input
              className="h-12 rounded-2xl border-[#D7D4CC] bg-[#EFEEE9] text-base font-serif placeholder:text-[#9DA1BE] dark:border-input dark:bg-[#161D30]"
              placeholder="Note title..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="space-y-2.5">
            <Label className="text-xs font-semibold tracking-[0.1em] text-[#A2A4C2]">CATEGORY</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-[14px] py-[6px] text-[13px] transition-colors ${
                    selectedCategoryId === category.id
                      ? "border-primary bg-primary font-semibold text-white shadow-[0_2px_10px_rgba(224,122,95,0.28)]"
                      : "border-transparent bg-muted text-[#6C708E] hover:border-border/80"
                  }`}
                  type="button"
                  onClick={() =>
                    setSelectedCategoryId((prev) => (prev === category.id ? undefined : category.id))
                  }
                  aria-pressed={selectedCategoryId === category.id}
                >
                  {category.name}
                </button>
              ))}
              <button className="rounded-full bg-muted px-[14px] py-[6px] text-[13px] text-[#6C708E]" type="button" onClick={() => router.push("/categories/new")}>
                + New
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            <Label className="text-xs font-semibold tracking-[0.1em] text-[#A2A4C2]">DESCRIPTION</Label>
            <Textarea
              className="min-h-40 rounded-2xl border-[#D7D4CC] bg-[#EFEEE9] text-base placeholder:text-[#9DA1BE] dark:border-input dark:bg-[#161D30]"
              placeholder="Start typing your note..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

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
