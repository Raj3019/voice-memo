import Link from "next/link"
import { Mic } from "lucide-react"

import { BrandWave } from "@/components/brand-wave"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F3F1EC] px-8 py-8 text-foreground dark:bg-[#070914]">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-sm flex-col items-center justify-center text-center">
        <div className="mb-8">
          <div className="mx-auto flex size-[90px] items-center justify-center rounded-[28px] bg-primary text-white shadow-[0_0_60px_rgba(224,122,95,0.35)]">
            <Mic className="size-[42px]" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="mb-2 font-serif text-[2.25rem] font-bold tracking-[-0.04em] text-[#0B0B34] dark:text-[#FFF4E8]">Voco</h1>
        <p className="mb-12 max-w-[240px] text-sm leading-relaxed text-[#5B5E79] dark:text-[#B8BCD9]">
          Capture thoughts as they come. AI does the rest.
        </p>

        <BrandWave barCount={24} maxHeight={40} />

        <div className="h-12" />

        <div className="w-full space-y-4">
          <Link href="/signup" className="block">
            <Button
              className="h-14 w-full rounded-2xl text-base font-semibold tracking-[-0.01em] shadow-[0_8px_32px_rgba(224,122,95,0.25)]"
              size="lg"
              type="button"
            >
              Get Started
            </Button>
          </Link>

          <Link
            className="inline-block px-2 py-2 text-sm text-[#4D5170] transition-colors hover:text-[#343858] dark:text-[#A9ADD1] dark:hover:text-[#D4D8F6]"
            href="/login"
          >
            I already have an account -&gt;
          </Link>
        </div>
      </section>
    </main>
  )
}
