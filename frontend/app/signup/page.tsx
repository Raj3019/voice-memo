"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { FormEvent } from "react"
import { ChevronLeft, Lock, Mail, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const fields = [
  { label: "FULL NAME", placeholder: "Full Name", type: "text", icon: UserRound },
  { label: "EMAIL", placeholder: "Email", type: "email", icon: Mail },
  { label: "PASSWORD", placeholder: "Password", type: "password", icon: Lock },
  { label: "CONFIRM PASSWORD", placeholder: "Confirm Password", type: "password", icon: Lock },
]

export default function SignUpPage() {
  const router = useRouter()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push("/notes")
  }

  return (
    <main className="min-h-screen bg-[#F3F1EC] px-6 py-6 text-foreground dark:bg-[#070914]">
      <section className="mx-auto w-full max-w-sm overflow-y-auto pt-6">
        <Link className="mb-7 inline-flex items-center gap-1 text-sm text-[#4D5170] dark:text-[#AAB0D2]" href="/login">
          <ChevronLeft className="size-[18px]" /> Back
        </Link>

        <header className="mb-8">
          <h1 className="font-serif text-[1.75rem] font-bold tracking-[-0.02em] text-[#0B0B34] dark:text-[#FFF4E8]">Create account</h1>
          <p className="mt-1.5 text-sm text-[#4D5170] dark:text-[#AAB0D2]">Start capturing your thoughts today</p>
        </header>

        <form className="space-y-3.5" onSubmit={handleSubmit}>
          {fields.map((field) => {
            const Icon = field.icon
            return (
              <div key={field.label}>
                <Label className="mb-2 block text-xs font-semibold tracking-[0.08em] text-[#A2A4C2]">{field.label}</Label>
                <div className="flex items-center gap-2.5 rounded-[14px] border border-[#D9D5CE] bg-[#EFEEE9] px-4 py-3.5 dark:border-input dark:bg-[#1A1C34]">
                  <Icon className="size-[17px] text-[#9FA3C1]" />
                  <Input
                    className="h-auto border-0 bg-transparent p-0 text-[15px] shadow-none focus-visible:ring-0"
                    placeholder={field.placeholder}
                    type={field.type}
                  />
                </div>
              </div>
            )
          })}

          <div className="pt-2">
            <Button className="h-14 w-full rounded-2xl text-base font-semibold" size="lg" type="submit">
              Create Account
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-[#4D5170] dark:text-[#AAB0D2]">
          Already have an account?{" "}
          <Link className="font-semibold text-primary" href="/login">
            Log In
          </Link>
        </p>
      </section>
    </main>
  )
}
