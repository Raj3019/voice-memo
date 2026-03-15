"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { FormEvent } from "react"
import { useState } from "react"
import { Apple, Chrome, Eye, EyeOff, Lock, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push("/notes")
  }

  return (
    <main className="min-h-screen bg-[#F3F1EC] px-6 py-6 text-foreground dark:bg-[#070914]">
      <section className="mx-auto w-full max-w-sm overflow-y-auto pt-8">
        <header className="mb-10 mt-8">
          <h1 className="font-serif text-[1.75rem] font-bold tracking-[-0.02em] text-[#0B0B34] dark:text-[#FFF4E8]">Welcome back</h1>
          <p className="mt-1.5 text-sm text-[#4D5170] dark:text-[#AAB0D2]">Log in to your Voco account</p>
        </header>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <Label className="mb-2 block text-xs font-semibold tracking-[0.08em] text-[#A2A4C2]">EMAIL</Label>
            <div className="flex items-center gap-2.5 rounded-[14px] border border-[#D9D5CE] bg-[#EFEEE9] px-4 py-3.5 dark:border-input dark:bg-[#1A1C34]">
              <Mail className="size-[17px] text-[#9FA3C1]" />
              <Input className="h-auto border-0 bg-transparent p-0 text-[15px] shadow-none focus-visible:ring-0" placeholder="you@example.com" type="email" />
            </div>
          </div>

          <div>
            <Label className="mb-2 block text-xs font-semibold tracking-[0.08em] text-[#A2A4C2]">PASSWORD</Label>
            <div className="flex items-center justify-between rounded-[14px] border border-[#D9D5CE] bg-[#EFEEE9] px-4 py-3.5 dark:border-input dark:bg-[#1A1C34]">
              <div className="flex items-center gap-2.5">
                <Lock className="size-[17px] text-[#9FA3C1]" />
                <Input
                  className="h-auto w-[130px] border-0 bg-transparent p-0 text-[15px] shadow-none focus-visible:ring-0"
                  placeholder="********"
                  type={showPw ? "text" : "password"}
                />
              </div>
              <button className="text-[#8A8FAB]" onClick={() => setShowPw((v) => !v)} type="button">
                {showPw ? <Eye className="size-[17px]" /> : <EyeOff className="size-[17px]" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <button className="text-[13px] text-primary" type="button">
              Forgot password?
            </button>
          </div>

          <Button className="h-14 w-full rounded-2xl text-base font-semibold" size="lg" type="submit">
            Log In
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <Separator className="flex-1 bg-border/90" />
          <span className="text-xs text-[#A2A4C2]">or continue with</span>
          <Separator className="flex-1 bg-border/90" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button className="h-12 rounded-[14px] border border-border bg-white/70 text-sm font-medium text-foreground dark:bg-[#1A1C34]" variant="outline">
            <Chrome className="size-[17px]" /> Google
          </Button>
          <Button className="h-12 rounded-[14px] border border-border bg-white/70 text-sm font-medium text-foreground dark:bg-[#1A1C34]" variant="outline">
            <Apple className="size-[17px]" /> Apple
          </Button>
        </div>

        <p className="mt-7 text-center text-sm text-[#4D5170] dark:text-[#AAB0D2]">
          Don&apos;t have an account?{" "}
          <Link className="font-semibold text-primary" href="/signup">
            Sign Up
          </Link>
        </p>
      </section>
    </main>
  )
}
