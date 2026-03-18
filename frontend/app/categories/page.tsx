"use client"

import Link from "next/link"
import { Folder, Plus } from "lucide-react"
import { useEffect, useState } from "react"

import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategories } from "@/lib/api/categories"
import { getNotes } from "@/lib/api/notes"
import { useRequireSession } from "@/lib/hooks/use-require-session"
import type { Category, Note } from "@/lib/types"

const cardStyles = [
  { color: "#E07A5F", bubble: "bg-[#F5E3DE]" },
  { color: "#6C9F8F", bubble: "bg-[#DFECE7]" },
  { color: "#D8B06C", bubble: "bg-[#EFE8DA]" },
  { color: "#8A79D6", bubble: "bg-[#E9E3F8]" },
  { color: "#5EAFC8", bubble: "bg-[#DCEFF5]" },
]

export default function CategoriesPage() {
  const { loading: sessionLoading } = useRequireSession()
  const [categories, setCategories] = useState<Category[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const [allCategories, notesResult] = await Promise.all([
          getCategories(),
          getNotes({ limit: 500 }),
        ])

        if (!active) return

        setCategories(allCategories)
        setNotes(notesResult.data)
      } catch (err) {
        if (!active) return
        const message = err && typeof err === "object" && "message" in err ? String(err.message) : "Failed to load categories"
        setError(message)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    if (!sessionLoading) {
      void load()
    }

    return () => {
      active = false
    }
  }, [sessionLoading])

  const notesCountByCategory = notes.reduce<Record<string, number>>((acc, note) => {
    if (note.categoryId) {
      acc[note.categoryId] = (acc[note.categoryId] || 0) + 1
    }
    return acc
  }, {})

  return (
    <main className="min-h-screen bg-[#D9D6CF] dark:bg-[#060A14]">
      <section className="mx-auto min-h-screen w-full max-w-sm bg-[#EAE8E2] dark:bg-[#0B1220]">
        <div className="flex items-center justify-between border-b border-border/60 bg-[#F6F5F2] px-5 pb-4 pt-7 dark:bg-[#101522]">
          <h1 className="font-serif text-4xl font-bold text-[#0B0B34] dark:text-[#FFF4E8]">Categories</h1>
          <Link href="/categories/new">
            <Button className="size-10 rounded-2xl" size="icon" type="button">
              <Plus className="size-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 bg-[#EAE8E2] px-5 pb-24 pt-5 dark:bg-[#0B1220]">
          {loading ? (
            <>
              <Skeleton className="h-[170px] rounded-3xl" />
              <Skeleton className="h-[170px] rounded-3xl" />
              <Skeleton className="h-[170px] rounded-3xl" />
              <Skeleton className="h-[170px] rounded-3xl" />
            </>
          ) : null}
          {error ? <p className="col-span-2 text-sm text-red-600">{error}</p> : null}

          {categories.map((category, index) => {
            const style = cardStyles[index % cardStyles.length]
            return (
              <Link href={`/categories/${category.slug}`} key={category.id}>
                <Card className="relative overflow-hidden rounded-3xl border-border/70 p-4">
                  <div className="mb-4 inline-flex size-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${style.color}1F` }}>
                    <Folder className="size-[18px]" style={{ color: style.color }} />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#101235] dark:text-[#F7EBDD]">{category.name}</h3>
                  <p className="mt-1 text-sm text-[#9D9FBC]">{notesCountByCategory[category.id] || 0} notes</p>
                  <span className={`absolute -bottom-4 -right-4 size-16 rounded-full ${style.bubble}`} />
                </Card>
              </Link>
            )
          })}

          <Link href="/categories/new">
            <Card className="flex min-h-[170px] items-center justify-center rounded-3xl border border-dashed border-border/90 bg-transparent text-[#A4A8C2]">
              <div className="text-center">
                <Plus className="mx-auto mb-2 size-6" />
                <p className="text-lg">New Category</p>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      <MobileBottomNav />
    </main>
  )
}
