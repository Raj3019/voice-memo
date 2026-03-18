"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronLeft, Chrome } from "lucide-react"

import { signInWithGoogle } from "@/lib/api/auth"
import { Button } from "@/components/ui/button"

export default function SignUpPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGoogleSignup = async () => {
    setLoading(true)
    setError("")

    try {
      const callbackURL = `${window.location.origin}/notes`
      const response = await signInWithGoogle(callbackURL)

      if (!response.url) {
        throw new Error("Google sign-up URL not returned by auth server")
      }

      window.location.href = response.url
    } catch (err) {
      const message = err && typeof err === "object" && "message" in err ? String(err.message) : "Google sign-up failed"
      setError(message)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F3F1EC] px-6 py-6 text-foreground dark:bg-[#070914]">
      <section className="mx-auto w-full max-w-sm overflow-y-auto pt-6">
        <Link className="mb-7 inline-flex items-center gap-1 text-sm text-[#4D5170] dark:text-[#AAB0D2]" href="/login">
          <ChevronLeft className="size-[18px]" /> Back
        </Link>

        <header className="mb-8">
          <h1 className="font-serif text-[1.75rem] font-bold tracking-[-0.02em] text-[#0B0B34] dark:text-[#FFF4E8]">Create account</h1>
          <p className="mt-1.5 text-sm text-[#4D5170] dark:text-[#AAB0D2]">Sign up with Google to start using Voco</p>
        </header>

        {/* Manual name/email/password signup intentionally disabled for now. */}

        <Button
          className="h-14 w-full rounded-2xl border border-border bg-white/70 text-base font-semibold text-foreground dark:bg-[#1A1C34]"
          size="lg"
          type="button"
          variant="outline"
          onClick={handleGoogleSignup}
          disabled={loading}
        >
          <Chrome className="size-[17px]" /> {loading ? "Redirecting..." : "Continue with Google"}
        </Button>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

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
