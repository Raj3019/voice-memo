"use client"

import Link from "next/link"
import { useState } from "react"
import { Chrome } from "lucide-react"

import { signInWithGoogle } from "@/lib/api/auth"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")

    try {
      const callbackURL = `${window.location.origin}/notes`
      const response = await signInWithGoogle(callbackURL)

      if (!response.url) {
        throw new Error("Google login URL not returned by auth server")
      }

      window.location.href = response.url
    } catch (err) {
      const message = err && typeof err === "object" && "message" in err ? String(err.message) : "Google sign-in failed"
      setError(message)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F3F1EC] px-6 py-6 text-foreground dark:bg-[#070914]">
      <section className="mx-auto w-full max-w-sm overflow-y-auto pt-8">
        <header className="mb-10 mt-8">
          <h1 className="font-serif text-[1.75rem] font-bold tracking-[-0.02em] text-[#0B0B34] dark:text-[#FFF4E8]">Welcome back</h1>
          <p className="mt-1.5 text-sm text-[#4D5170] dark:text-[#AAB0D2]">Continue with Google to access your Voco account</p>
        </header>

        {/* Email/password login intentionally disabled for now. */}

        <div className="my-5 flex items-center gap-3">
          <Separator className="flex-1 bg-border/90" />
          <span className="text-xs text-[#A2A4C2]">continue with</span>
          <Separator className="flex-1 bg-border/90" />
        </div>

        <Button
          className="h-12 w-full rounded-[14px] border border-border bg-white/70 text-sm font-medium text-foreground dark:bg-[#1A1C34]"
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <Chrome className="size-[17px]" /> {loading ? "Redirecting..." : "Google"}
        </Button>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

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
