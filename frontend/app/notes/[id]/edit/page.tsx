"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { X } from "lucide-react"

import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { getCategories } from "@/lib/api/categories"
import { getNoteById, updateNote } from "@/lib/api/notes"
import { useRequireSession } from "@/lib/hooks/use-require-session"
import type { Category } from "@/lib/types"

export default function EditNotePage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const noteId = useMemo(() => params?.id || "", [params])
  const { loading: sessionLoading } = useRequireSession()

  const [categories, setCategories] = useState<Category[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const allCategories = await getCategories()
        const detail = await getNoteById(noteId, allCategories)

        if (!active) return

        if (!detail) {
          setError("Note not found")
          return
        }

        setCategories(allCategories)
        setTitle(detail.note.title)
        setDescription(detail.note.description)
        setCategoryId(detail.note.categoryId || undefined)
      } catch (err) {
        if (!active) return
        const message = err && typeof err === "object" && "message" in err ? String(err.message) : "Failed to load note"
        setError(message)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    if (!sessionLoading && noteId) {
      void load()
    }

    return () => {
      active = false
    }
  }, [noteId, sessionLoading])

  const handleSave = async () => {
    setSaving(true)
    setError("")
    try {
      await updateNote(noteId, { title, description, categoryId })
      router.push(`/notes/${noteId}`)
    } catch (err) {
      const message = err && typeof err === "object" && "message" in err ? String(err.message) : "Failed to update note"
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#D9D6CF] dark:bg-[#060A14]">
        <section className="mx-auto min-h-screen w-full max-w-sm space-y-4 bg-[#EAE8E2] px-5 py-6 dark:bg-[#0B1220]">
          <Skeleton className="h-6 w-28 rounded-md" />
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-8 w-20 rounded-md" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
          </div>
          <Skeleton className="h-44 w-full rounded-2xl" />
        </section>
        <MobileBottomNav />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#D9D6CF] dark:bg-[#060A14]">
      <section className="mx-auto min-h-screen w-full max-w-sm bg-[#EAE8E2] dark:bg-[#0B1220]">
        <header className="flex items-center justify-between border-b border-border/60 bg-[#F6F5F2] px-5 py-4 dark:bg-[#101522]">
          <Link className="inline-flex items-center gap-1 text-base text-[#656A88]" href={`/notes/${noteId}`}>
            <X className="size-4" /> Cancel
          </Link>
          <h1 className="font-serif text-xl font-bold text-[#0B0B34] dark:text-[#FFF4E8]">Edit Note</h1>
          <Button className="h-9 rounded-full px-5 text-sm font-semibold" size="sm" type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </header>

        <div className="space-y-5 px-5 pb-24 pt-5">
          <div className="space-y-2.5">
            <Label className="text-xs font-semibold tracking-[0.1em] text-[#A2A4C2]">TITLE</Label>
            <Input
              className="h-12 rounded-2xl border-[#D7D4CC] bg-[#EFEEE9] text-base font-serif placeholder:text-[#9DA1BE] dark:border-input dark:bg-[#161D30]"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="space-y-2.5">
            <Label className="text-xs font-semibold tracking-[0.1em] text-[#A2A4C2]">CATEGORY</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  className="h-8 rounded-full px-4 text-sm"
                  size="sm"
                  type="button"
                  variant={categoryId === category.id ? "default" : "secondary"}
                  onClick={() => setCategoryId(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <Label className="text-xs font-semibold tracking-[0.1em] text-[#A2A4C2]">DESCRIPTION</Label>
            <Textarea
              className="min-h-44 rounded-2xl border-[#D7D4CC] bg-[#EFEEE9] text-base placeholder:text-[#9DA1BE] dark:border-input dark:bg-[#161D30]"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      </section>
      <MobileBottomNav />
    </main>
  )
}
