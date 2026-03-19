"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, ChevronLeft, Loader2, Mic, Trash2, Upload, Zap } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getNoteStatus, uploadNoteAudio } from "@/lib/api/notes"
import { useRequireSession } from "@/lib/hooks/use-require-session"
import { buildNotePath } from "@/lib/note-route"

type UploadState = "idle" | "recording" | "processing"
type BackendStatus = "uploading" | "processing" | "completed"

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
            animationName: "pulse",
            animationDuration: "2s",
            animationTimingFunction: "ease-out",
            animationIterationCount: "infinite",
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
            animationName: "wave",
            animationDuration: `${0.8 + (i % 5) * 0.15}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDirection: "alternate",
            animationDelay: `${i * 0.04}s`,
          }}
        />
      ))}
    </div>
  )
}

async function getAudioDurationSeconds(file: File): Promise<number> {
  return new Promise((resolve) => {
    const audio = document.createElement("audio")
    const objectUrl = URL.createObjectURL(file)

    audio.preload = "metadata"
    audio.src = objectUrl

    audio.onloadedmetadata = () => {
      const value = Number.isFinite(audio.duration) ? Math.max(1, Math.round(audio.duration)) : 30
      URL.revokeObjectURL(objectUrl)
      resolve(value)
    }

    audio.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(30)
    }
  })
}

export default function VoiceMemoPage() {
  useRequireSession()
  const router = useRouter()

  const [state, setState] = useState<UploadState>("idle")
  const [error, setError] = useState("")
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("uploading")
  const [uploadPercent, setUploadPercent] = useState(0)
  const [processingPercent, setProcessingPercent] = useState(0)
  const [audioDurationSeconds, setAudioDurationSeconds] = useState(30)
  const [noteId, setNoteId] = useState("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const totalPercent = useMemo(() => {
    if (backendStatus === "completed") return 100
    if (backendStatus === "uploading") return Math.min(30, Math.max(5, Math.round(uploadPercent * 0.3)))
    return Math.min(98, 30 + Math.round(processingPercent * 0.68))
  }, [backendStatus, processingPercent, uploadPercent])

  const currentStep = useMemo(() => {
    if (backendStatus === "completed") return 2
    if (backendStatus === "processing") return 1
    return 0
  }, [backendStatus])

  const handleUploadFile = async (file: File) => {
    setError("")
    setState("processing")
    setBackendStatus("uploading")
    setUploadPercent(0)
    setProcessingPercent(0)
    setNoteId("")

    const duration = await getAudioDurationSeconds(file)
    setAudioDurationSeconds(duration)

    try {
      const upload = await uploadNoteAudio(file, setUploadPercent)
      setNoteId(upload.noteSlug || upload.noteId)
      setBackendStatus("processing")
      setUploadPercent(100)
    } catch (err) {
      const message = err && typeof err === "object" && "message" in err ? String(err.message) : "Audio upload failed"
      setError(message)
      setState("idle")
    }
  }

  useEffect(() => {
    if (state !== "processing" || backendStatus !== "processing") return

    const baseSeconds = Math.max(25, Math.min(180, Math.round(audioDurationSeconds * 2.2)))
    const step = Math.max(1, Math.round(100 / baseSeconds))

    const timer = setInterval(() => {
      setProcessingPercent((prev) => Math.min(95, prev + step))
    }, 1000)

    return () => clearInterval(timer)
  }, [audioDurationSeconds, backendStatus, state])

  useEffect(() => {
    if (!noteId || state !== "processing") return

    let active = true
    const interval = setInterval(async () => {
      try {
        const status = await getNoteStatus(noteId)
        if (!active || !status) return

        if (status === "completed") {
          setBackendStatus("completed")
          setProcessingPercent(100)
          clearInterval(interval)

          setTimeout(() => {
            router.push(buildNotePath(noteId))
          }, 900)

          return
        }

        if (status === "processing") {
          setBackendStatus("processing")
        }
      } catch {
        // Keep polling for transient errors.
      }
    }, 2500)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [noteId, router, state])

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

              <input
                className="hidden"
                type="file"
                accept="audio/*"
                ref={fileInputRef}
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (!file) return
                  void handleUploadFile(file)
                  event.target.value = ""
                }}
              />

              <Button
                className="h-12 w-full rounded-2xl bg-card text-base text-[#5D6180] hover:bg-card/90 dark:text-[#AAB0D2]"
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
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

              <p className="mb-2 font-mono text-[40px] font-light tracking-[2px] text-[#1C1D3A] dark:text-[#E8E3DA]">0:00</p>

              <div className="mb-10 flex items-center gap-2 text-sm text-[#9C9FBC]">
                <span className="size-2 animate-pulse rounded-full bg-red-500" />
                Recording preview only
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
                  onClick={() => setState("idle")}
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
                {backendStatus === "completed" ? <Check className="size-8 text-primary" /> : <Zap className="size-8 text-primary" />}
              </div>

              <h2 className="mb-2 font-serif text-[18px] font-semibold text-[#0B0B34] dark:text-[#FFF4E8]">
                {backendStatus === "completed" ? "Memo ready" : "AI is processing your memo..."}
              </h2>
              <p className="mb-2 text-sm leading-relaxed text-[#5D6180] dark:text-[#AAB0D2]">
                {backendStatus === "uploading"
                  ? `Uploading audio ${uploadPercent}%`
                  : backendStatus === "processing"
                    ? `Crafting your note ${totalPercent}%`
                    : "Opening your processed note..."}
              </p>

              <div className="mb-6 h-2 overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${totalPercent}%` }} />
              </div>

              <div className="space-y-2.5 text-left">
                {[
                  "Listening to your voice memo",
                  "Building title and summary",
                  "Preparing your note for search",
                ].map((step, i) => (
                  <Card key={step} className="gap-0 rounded-xl border-border/70 bg-card px-3.5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`inline-flex size-[18px] items-center justify-center rounded-full ${i < currentStep ? "bg-primary" : i === currentStep ? "bg-primary/20" : "bg-border"}`}>
                        {i < currentStep ? <Check className="size-3 text-white" /> : i === currentStep ? <Loader2 className="size-3 animate-spin text-primary" /> : null}
                      </span>
                      <span className={`text-sm ${i <= currentStep ? "text-[#1C1D3A] dark:text-[#E8E3DA]" : "text-[#9C9FBC]"}`}>{step}</span>
                    </div>
                  </Card>
                ))}
              </div>

              {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
            </div>
          ) : null}
        </div>
      </section>

      <style>{`@keyframes pulse { 0% { transform: scale(0.95); opacity: 0.4; } 100% { transform: scale(1.15); opacity: 0; } }
      @keyframes wave { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }`}</style>
    </main>
  )
}


