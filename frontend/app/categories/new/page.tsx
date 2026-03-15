"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { FormEvent } from "react"
import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function NewCategoryPage() {
  const router = useRouter()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push("/categories")
  }

  return (
    <main className="min-h-screen bg-[#D9D6CF] dark:bg-[#060A14]">
      <section className="mx-auto min-h-screen w-full max-w-sm bg-[#EAE8E2] dark:bg-[#0B1220]">
        <header className="flex items-center justify-between border-b border-border/60 bg-[#F6F5F2] px-5 pb-4 pt-7 dark:bg-[#101522]">
          <Link className="inline-flex items-center gap-1 text-sm text-[#656A88]" href="/categories">
            <X className="size-4" /> Cancel
          </Link>
          <h1 className="text-base font-semibold text-[#0B0B34] dark:text-[#FFF4E8]">New Category</h1>
          <Button className="h-9 rounded-full px-5 text-sm font-semibold text-white dark:text-white" size="sm" type="submit" form="new-category-form">
            Save
          </Button>
        </header>

        <form className="space-y-5 px-5 py-5" id="new-category-form" onSubmit={handleSubmit}>
          <div className="space-y-2.5">
            <Label className="text-xs font-semibold tracking-[0.1em] text-[#A2A4C2]">CATEGORY NAME</Label>
            <Input
              className="h-12 rounded-2xl border-[#D7D4CC] bg-[#EFEEE9] text-base placeholder:text-[#9DA1BE] dark:border-input dark:bg-[#161D30]"
              placeholder="e.g. Meetings"
              required
            />
          </div>

          <Button className="h-12 w-full rounded-2xl border border-dashed border-primary/45 bg-primary/10 text-[15px] font-medium text-primary hover:bg-primary/15" type="button" variant="outline">
            <Plus className="size-4" /> Add Category
          </Button>
        </form>
      </section>
    </main>
  )
}
