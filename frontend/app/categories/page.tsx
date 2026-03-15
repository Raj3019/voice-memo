import Link from "next/link"
import { Folder, Plus } from "lucide-react"

import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { mockCategories } from "@/lib/mock-categories"

export default function CategoriesPage() {
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
          {mockCategories.map((category) => (
            <Link href={`/categories/${category.slug}`} key={category.slug}>
              <Card className="relative overflow-hidden rounded-3xl border-border/70 p-4">
                <div className="mb-4 inline-flex size-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${category.color}1F` }}>
                  <Folder className="size-[18px]" style={{ color: category.color }} />
                </div>
                <h3 className="font-serif text-xl font-semibold text-[#101235] dark:text-[#F7EBDD]">{category.name}</h3>
                <p className="mt-1 text-sm text-[#9D9FBC]">{category.notes} notes</p>
                <span className={`absolute -bottom-4 -right-4 size-16 rounded-full ${category.bubble}`} />
              </Card>
            </Link>
          ))}

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
