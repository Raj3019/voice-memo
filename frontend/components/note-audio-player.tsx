"use client"

import { Pause, Play, RotateCcw, RotateCw } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type NoteAudioPlayerProps = {
  duration: string
  audioUrl?: string
  onTimeUpdate?: (seconds: number) => void
  onPlayStateChange?: (playing: boolean) => void
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

export function NoteAudioPlayer({ duration, audioUrl, onTimeUpdate, onPlayStateChange }: NoteAudioPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalTime, setTotalTime] = useState(parseDurationLabel(duration))
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const waveformTrackRef = useRef<HTMLDivElement | null>(null)
  const scrubbingRef = useRef(false)
  const waveformBars = useMemo(() => Array.from({ length: 44 }, (_, i) => baseBars[i % baseBars.length]), [])

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
      onTimeUpdate?.(audio.currentTime)
    }

    const handleEnded = () => {
      setPlaying(false)
      setCurrentTime(0)
      audio.currentTime = 0
      onPlayStateChange?.(false)
      onTimeUpdate?.(0)
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
  }, [audioUrl, onPlayStateChange, onTimeUpdate])

  const setAudioPosition = (nextTime: number) => {
    const audio = audioRef.current
    if (!audio || totalTime <= 0) return

    const clamped = Math.min(totalTime, Math.max(0, nextTime))
    audio.currentTime = clamped
    setCurrentTime(clamped)
    onTimeUpdate?.(clamped)
  }

  const seekFromTrack = (clientX: number, track: HTMLDivElement | null) => {
    if (!track || totalTime <= 0) return

    const rect = track.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    setAudioPosition(ratio * totalTime)
  }

  const handleWavePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    scrubbingRef.current = true
    seekFromTrack(event.clientX, waveformTrackRef.current)
  }

  const handleWavePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!scrubbingRef.current) return
    seekFromTrack(event.clientX, waveformTrackRef.current)
  }

  const stopScrubbing = () => {
    scrubbingRef.current = false
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      void audio.play()
      setPlaying(true)
      onPlayStateChange?.(true)
      return
    }

    audio.pause()
    setPlaying(false)
    onPlayStateChange?.(false)
  }

  const seekBySeconds = (delta: number) => {
    const audio = audioRef.current
    if (!audio || totalTime <= 0) return
    setAudioPosition(audio.currentTime + delta)
  }

  const playedBars = useMemo(() => {
    if (!totalTime || totalTime <= 0) return 0
    return Math.floor((currentTime / totalTime) * waveformBars.length)
  }, [currentTime, totalTime, waveformBars.length])

  const displayDuration = useMemo(() => {
    if (audioUrl && totalTime > 0) {
      return `${toClock(currentTime)} / ${toClock(totalTime)}`
    }

    return duration || "0:00"
  }, [audioUrl, currentTime, duration, totalTime])

  return (
    <Card className="gap-0 rounded-3xl border-border/70 bg-card p-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-2">
        <Button
          className="size-8 rounded-full border border-border/80 bg-transparent text-[#9EA2C0] hover:bg-muted hover:text-primary"
          size="icon"
          type="button"
          variant="ghost"
          onClick={() => seekBySeconds(-10)}
        >
          <RotateCcw className="size-4" />
        </Button>

        <Button
          className="size-[42px] rounded-full shadow-[0_4px_16px_rgba(224,122,95,0.25)]"
          size="icon"
          type="button"
          onClick={togglePlay}
        >
          {playing ? <Pause className="size-4.5" /> : <Play className="size-4.5 fill-current" />}
        </Button>

        <Button
          className="size-8 rounded-full border border-border/80 bg-transparent text-[#9EA2C0] hover:bg-muted hover:text-primary"
          size="icon"
          type="button"
          variant="ghost"
          onClick={() => seekBySeconds(10)}
        >
          <RotateCw className="size-4" />
        </Button>

        <div
          ref={waveformTrackRef}
          className="min-w-0 flex-1 cursor-pointer touch-none"
          onPointerDown={handleWavePointerDown}
          onPointerMove={handleWavePointerMove}
          onPointerUp={stopScrubbing}
          onPointerCancel={stopScrubbing}
          onPointerLeave={stopScrubbing}
        >
          <div className="flex w-full items-center justify-between">
            {waveformBars.map((h, i) => (
              <span
                key={`${h}-${i}`}
                className={`w-[2px] shrink-0 rounded-full ${i <= playedBars ? "bg-primary" : "bg-primary/35"}`}
                style={{
                  height: `${(h / 100) * 28}px`,
                  opacity: i <= playedBars ? 0.95 : 0.45,
                  transform: playing && i <= playedBars ? "scaleY(1.03)" : "scaleY(1)",
                  transition: "all 120ms ease-out",
                }}
              />
            ))}
          </div>
        </div>

        <span className="shrink-0 whitespace-nowrap text-[11px] tabular-nums text-[#9EA2C0]">{displayDuration}</span>
      </div>

    </Card>
  )
}
