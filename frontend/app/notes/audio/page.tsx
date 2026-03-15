"use client"

import Link from "next/link"
import { Check, ChevronLeft, Mic, Trash2, Upload, Zap } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type UploadState = "idle" | "recording" | "processing"

const bars = [30, 55, 40, 80, 60, 90, 45, 70, 85, 50, 65, 95, 55, 75, 40, 85, 60, 70, 50, 90, 65, 45, 80, 55, 40, 70, 55, 35]

function RecordingPulse() {
  return (
    <div className="relative flex items-center justify-center">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full border border-primary/35"
          style={{
            width: `${80 + i * 30}px`,
            height: `${80 + i * 30}px`,
            opacity: 0.3 - i * 0.08,
            animation: `pulse 2s ease-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
    </div>
  )
}

function LiveWaveform() {
  return (
    <div className="flex h-[60px] items-center justify-center gap-[2px]">
      {bars.slice(0, 34).map((h, i) => (
        <span
          key={`${h}-${i}`}
          className="w-[2.5px] rounded-full bg-primary"
          style={{
            height: `${(h / 100) * 60}px`,
            opacity: 0.9,
            animation: `wave ${0.8 + (i % 5) * 0.15}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.04}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function VoiceMemoPage() {
  const [state, setState] = useState<UploadState>("idle")

  return (
    <main className="min-h-screen bg-[#D9D6CF] dark:bg-[#060A14]">
      <section className="mx-auto min-h-screen w-full max-w-sm bg-[#EAE8E2] dark:bg-[#0B1220]">
        <header className="border-b border-border/60 bg-[#F6F5F2] px-5 pb-4 pt-7 dark:bg-[#101522]">
          <div className="flex items-center gap-3">
            <Link className="text-[#656A88]" href="/notes">
              <ChevronLeft className="size-5" />
            </Link>
            <h1 className="font-serif text-[20px] font-bold text-[#0B0B34] dark:text-[#FFF4E8]">Voice Memo</h1>
          </div>
        </header>

        <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-8 pb-10">
          {state === "idle" ? (
            <>
              <p className="mb-12 text-center text-sm text-[#5D6180] dark:text-[#AAB0D2]">
                Tap the mic to start recording or upload an audio file
              </p>

              <div className="relative mb-12 flex size-[120px] items-center justify-center">
                <RecordingPulse />
                <Button
                  className="relative z-10 size-20 rounded-full shadow-[0_8px_32px_rgba(224,122,95,0.25)]"
                  size="icon"
                  type="button"
                  onClick={() => setState("recording")}
                >
                  <Mic className="size-8" />
                </Button>
              </div>

              <div className="mb-8 flex w-full items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-[#9C9FBC]">or</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <Button
                className="h-12 w-full rounded-2xl bg-card text-base text-[#5D6180] hover:bg-card/90 dark:text-[#AAB0D2]"
                type="button"
                variant="outline"
              >
                <Upload className="size-4" /> Upload audio file
              </Button>
            </>
          ) : null}

          {state === "recording" ? (
            <>
              <div className="mb-10 w-full">
                <LiveWaveform />
              </div>

              <p className="mb-2 font-mono text-[40px] font-light tracking-[2px] text-[#1C1D3A] dark:text-[#E8E3DA]">0:42</p>

              <div className="mb-10 flex items-center gap-2 text-sm text-[#9C9FBC]">
                <span className="size-2 animate-pulse rounded-full bg-red-500" />
                Recording
              </div>

              <div className="flex items-center gap-6">
                <Button
                  className="size-[52px] rounded-full border border-border bg-card text-red-500 hover:bg-card/90"
                  size="icon"
                  type="button"
                  variant="outline"
                  onClick={() => setState("idle")}
                >
                  <Trash2 className="size-5" />
                </Button>

                <Button
                  className="size-[68px] rounded-full bg-red-500 text-white shadow-[0_8px_32px_rgba(220,80,80,0.35)] hover:bg-red-600"
                  size="icon"
                  type="button"
                  onClick={() => setState("processing")}
                >
                  <span className="size-5 rounded-sm bg-white" />
                </Button>

                <div className="size-[52px]" />
              </div>
            </>
          ) : null}

          {state === "processing" ? (
            <div className="w-full text-center">
              <div className="mx-auto mb-6 flex size-[72px] items-center justify-center rounded-full border border-primary/35 bg-primary/10">
                <Zap className="size-8 text-primary" />
              </div>

              <h2 className="mb-2 font-serif text-[18px] font-semibold text-[#0B0B34] dark:text-[#FFF4E8]">AI is processing your memo...</h2>
              <p className="mb-8 text-sm leading-relaxed text-[#5D6180] dark:text-[#AAB0D2]">
                Transcribing -&gt; Generating title &amp; summary -&gt; Creating embeddings
              </p>

              <div className="space-y-2.5 text-left">
                {[
                  "Transcribing audio (Deepgram)",
                  "Generating title & summary (Groq)",
                  "Creating embeddings (Gemini)",
                ].map((step, i) => (
                  <Card key={step} className="gap-0 rounded-xl border-border/70 bg-card px-3.5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`inline-flex size-[18px] items-center justify-center rounded-full ${
                          i === 0 ? "bg-emerald-500" : i === 1 ? "bg-primary" : "bg-border"
                        }`}
                      >
                        {i < 2 ? <Check className="size-3 text-white" /> : null}
                      </span>
                      <span className={`text-sm ${i < 2 ? "text-[#1C1D3A] dark:text-[#E8E3DA]" : "text-[#9C9FBC]"}`}>{step}</span>
                    </div>
                  </Card>
                ))}
              </div>

              <Link href="/notes/team-sync-q3">
                <Button className="mt-8 h-10 rounded-xl border-border bg-card px-5 text-[13px] text-[#5D6180] dark:text-[#AAB0D2]" type="button" variant="outline">
                  Continue in background
                </Button>
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      <style>{`@keyframes pulse { 0% { transform: scale(0.95); opacity: 0.4; } 100% { transform: scale(1.15); opacity: 0; } }
      @keyframes wave { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }`}</style>
    </main>
  )
}
