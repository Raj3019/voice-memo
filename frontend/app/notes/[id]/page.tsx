"use client"

import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, Clock3, Mic, SquarePen, Trash2, Zap } from "lucide-react"

import { NoteAudioPlayer } from "@/components/note-audio-player"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategories } from "@/lib/api/categories"
import { deleteNote, getNoteById } from "@/lib/api/notes"
import { useRequireSession } from "@/lib/hooks/use-require-session"
import { buildEditNotePath } from "@/lib/note-route"
import type { AudioFile, Note } from "@/lib/types"

export default function NoteDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const noteId = useMemo(() => params?.id || "", [params])
  const { loading: sessionLoading } = useRequireSession()

  const [note, setNote] = useState<Note | null>(null)
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState(false)
  const [audioCurrentTime, setAudioCurrentTime] = useState(0)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const hasAudio = Boolean(audioFiles[0]?.url)
  const transcriptTokens = useMemo(() => note?.transcriptTimestamps || [], [note])
  const shouldSyncTranscript = hasAudio && audioPlaying && transcriptTokens.length > 0
  const activeTokenIndex = useMemo(() => {
    if (!shouldSyncTranscript) return -1
    return transcriptTokens.findIndex((token) => audioCurrentTime >= token.start && audioCurrentTime <= token.end)
  }, [audioCurrentTime, shouldSyncTranscript, transcriptTokens])

  useEffect(() => {
    if (!hasAudio) {
      setAudioPlaying(false)
      setAudioCurrentTime(0)
    }
  }, [hasAudio])

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const categories = await getCategories()
        const detail = await getNoteById(noteId, categories)

        if (!active) return

        if (!detail) {
          setError("Note not found")
          return
        }

        setNote(detail.note)
        setAudioFiles(detail.audioFiles)
      } catch (err) {
        if (!active) return
        const message = err && typeof err === "object" && "message" in err ? String(err.message) : "Failed to load note"
        setError(message)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    if (!sessionLoading && noteId) {
      void load()
    }

    return () => {
      active = false
    }
  }, [noteId, sessionLoading])

  const handleDelete = async () => {
    if (!noteId) return

    setDeleting(true)
    try {
      await deleteNote(noteId)
      router.push("/notes")
    } catch (err) {
      const message = err && typeof err === "object" && "message" in err ? String(err.message) : "Failed to delete note"
      setError(message)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#D9D6CF] dark:bg-[#060A14]">
        <section className="mx-auto min-h-screen w-full max-w-sm space-y-4 bg-[#EAE8E2] px-5 py-6 dark:bg-[#0B1220]">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-6 w-36 rounded-md" />
          <Skeleton className="h-28 w-full rounded-3xl" />
          <Skeleton className="h-48 w-full rounded-3xl" />
          <Skeleton className="h-40 w-full rounded-3xl" />
        </section>
        <MobileBottomNav />
      </main>
    )
  }

  if (!note) {
    return (
      <main className="min-h-screen bg-[#D9D6CF] dark:bg-[#060A14]">
        <section className="mx-auto min-h-screen w-full max-w-sm bg-[#EAE8E2] px-5 py-6 dark:bg-[#0B1220]">
          <p className="text-sm text-red-600">{error || "Note not found"}</p>
        </section>
        <MobileBottomNav />
      </main>
    )
  }

  const duration = note.time || ""
  const createdTime = new Date(note.createdAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })

  return (
    <main className="min-h-screen bg-[#D9D6CF] dark:bg-[#060A14]">
      <section className="mx-auto min-h-screen w-full max-w-sm bg-[#EAE8E2] dark:bg-[#0B1220]">
        <header className="border-b border-border/60 bg-[#F6F5F2] px-5 pb-4 pt-7 dark:bg-[#101522]">
          <div className="mb-4 flex items-center justify-between">
            <Link className="inline-flex items-center gap-1 text-sm text-[#656A88]" href="/notes">
              <ChevronLeft className="size-4" /> Notes
            </Link>
            <div className="flex items-center gap-2">
              <Link href={buildEditNotePath(note.slug)}>
                <Button className="size-9 rounded-xl border border-border bg-card text-[#7E829F]" size="icon" variant="outline">
                  <SquarePen className="size-4" strokeWidth={1.8} />
                </Button>
              </Link>
              <Button className="size-9 rounded-xl border border-border bg-card text-primary" size="icon" type="button" variant="outline" onClick={handleDelete} disabled={deleting}>
                <Trash2 className="size-4" strokeWidth={1.8} />
              </Button>
            </div>
          </div>

          <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary hover:bg-primary/10">{note.categoryName}</Badge>

          <h1 className="mt-3 font-serif text-[1.38rem] font-bold leading-tight text-[#0B0B34] dark:text-[#FFF4E8]">{note.title}</h1>

          <div className="mt-2 flex items-center gap-3 text-xs text-[#9EA2C0]">
            <span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" /> {note.dayLabel}, {createdTime}</span>
            {duration ? <span className="inline-flex items-center gap-1"><Mic className="size-3.5" /> {duration}</span> : null}
          </div>
        </header>

        <div className="space-y-4 px-5 pb-24 pt-5">
          {audioFiles[0] ? (
            <NoteAudioPlayer
              duration={duration || "0:00"}
              audioUrl={audioFiles[0].url}
              onTimeUpdate={setAudioCurrentTime}
              onPlayStateChange={setAudioPlaying}
            />
          ) : null}

          <div className="rounded-3xl border border-primary/25 bg-primary/7 p-4">
            <p className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold tracking-[0.08em] text-primary">
              <Zap className="size-3.5" /> AI SUMMARY
            </p>
            <p className="text-[0.95rem] leading-[1.7] text-[#1C1D3A] dark:text-[#E8E3DA]">{note.description || "No description yet."}</p>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold tracking-[0.08em] text-[#A1A4BF]">TRANSCRIPT</p>
            {transcriptTokens.length > 0 ? (
              <div
                className="text-[0.95rem] leading-[1.8] text-[#1C1D3A] dark:text-[#E8E3DA]"
              >
                {transcriptTokens.map((token, index) => {
                  const isActive = shouldSyncTranscript && activeTokenIndex === index
                  return (
                    <span
                      key={`${token.start}-${index}`}
                      className={`rounded px-[2px] transition-colors duration-150 ${
                        isActive ? "bg-primary/20 text-primary" : ""
                      }`}
                    >
                      {token.text}{" "}
                    </span>
                  )
                })}
              </div>
            ) : (
              <p className="text-[0.95rem] leading-[1.8] text-[#1C1D3A] dark:text-[#E8E3DA]">
                {note.transcript || "No transcript available yet."}
              </p>
            )}
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      </section>
      <MobileBottomNav />
    </main>
  )
}
