"use client"

import { Pause, Play } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type NoteAudioPlayerProps = {
  duration: string
  audioUrl?: string
}

const baseBars = [30, 55, 40, 80, 60, 90, 45, 70, 85, 50, 65, 95, 55, 75, 40, 85, 60, 70, 50, 90, 65, 45, 80, 55]

function toClock(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.max(0, Math.floor(seconds % 60))
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function parseDurationLabel(label: string): number {
  const [mins, secs] = label.split(":").map((part) => Number(part) || 0)
  return mins * 60 + secs
}

export function NoteAudioPlayer({ duration, audioUrl }: NoteAudioPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalTime, setTotalTime] = useState(parseDurationLabel(duration))
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const waveformBars = useMemo(() => Array.from({ length: 40 }, (_, i) => baseBars[i % baseBars.length]), [])

  useEffect(() => {
    if (!audioUrl) {
      return
    }

    const audio = new Audio(audioUrl)
    audioRef.current = audio

    const handleLoaded = () => {
      if (!Number.isNaN(audio.duration) && audio.duration > 0) {
        setTotalTime(audio.duration)
      }
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setPlaying(false)
      setCurrentTime(0)
      audio.currentTime = 0
    }

    audio.addEventListener("loadedmetadata", handleLoaded)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.pause()
      audio.removeEventListener("loadedmetadata", handleLoaded)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audioRef.current = null
    }
  }, [audioUrl])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) {
      setPlaying((v) => !v)
      return
    }

    if (audio.paused) {
      void audio.play()
      setPlaying(true)
      return
    }

    audio.pause()
    setPlaying(false)
  }

  const progress = useMemo(() => {
    if (!totalTime || totalTime <= 0) return 0
    return Math.min(100, (currentTime / totalTime) * 100)
  }, [currentTime, totalTime])

  const displayDuration = useMemo(() => {
    if (audioUrl && totalTime > 0) {
      return `${toClock(currentTime)} / ${toClock(totalTime)}`
    }

    return duration || "0:00"
  }, [audioUrl, currentTime, duration, totalTime])

  return (
    <Card className="gap-0 rounded-3xl border-border/70 bg-card p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <div className="mb-3 flex items-center gap-3">
        <Button
          className="size-[42px] rounded-full shadow-[0_4px_16px_rgba(224,122,95,0.25)]"
          size="icon"
          type="button"
          onClick={togglePlay}
        >
          {playing ? <Pause className="size-4.5" /> : <Play className="size-4.5 fill-current" />}
        </Button>

        <div className="flex flex-1 items-center gap-[1.5px]">
          {waveformBars.map((h, i) => (
            <span
              key={`${h}-${i}`}
              className="w-[2.5px] shrink-0 rounded-full bg-primary"
              style={{
                height: `${(h / 100) * 32}px`,
                opacity: 0.5 + h / 200,
                animationName: playing ? "wave" : undefined,
                animationDuration: playing ? `${0.8 + (i % 5) * 0.15}s` : undefined,
                animationTimingFunction: playing ? "ease-in-out" : undefined,
                animationIterationCount: playing ? "infinite" : undefined,
                animationDirection: playing ? "alternate" : undefined,
                animationDelay: playing ? `${i * 0.04}s` : undefined,
              }}
            />
          ))}
        </div>

        <span className="shrink-0 text-xs text-[#9EA2C0]">{displayDuration}</span>
      </div>

      <div className="h-[3px] overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <style>{`@keyframes wave { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }`}</style>
    </Card>
  )
}
