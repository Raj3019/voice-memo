"use client"

import { Pause, Play } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type NoteAudioPlayerProps = {
  duration: string
}

const bars = [30, 55, 40, 80, 60, 90, 45, 70, 85, 50, 65, 95, 55, 75, 40, 85, 60, 70, 50, 90, 65, 45, 80, 55]

export function NoteAudioPlayer({ duration }: NoteAudioPlayerProps) {
  const [playing, setPlaying] = useState(false)

  return (
    <Card className="gap-0 rounded-3xl border-border/70 bg-card p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <div className="mb-3 flex items-center gap-3">
        <Button
          className="size-[42px] rounded-full shadow-[0_4px_16px_rgba(224,122,95,0.25)]"
          size="icon"
          type="button"
          onClick={() => setPlaying((v) => !v)}
        >
          {playing ? <Pause className="size-4.5" /> : <Play className="size-4.5 fill-current" />}
        </Button>

        <div className="flex flex-1 items-center gap-[2px]">
          {bars.map((h, i) => (
            <span
              key={`${h}-${i}`}
              className="w-[2.5px] rounded-full bg-primary"
              style={{
                height: `${(h / 100) * 32}px`,
                opacity: 0.5 + h / 200,
                animation: playing ? `wave ${0.8 + (i % 5) * 0.15}s ease-in-out infinite alternate` : "none",
                animationDelay: `${i * 0.04}s`,
              }}
            />
          ))}
        </div>

        <span className="shrink-0 text-xs text-[#9EA2C0]">{duration}</span>
      </div>

      <div className="h-[3px] overflow-hidden rounded-full bg-border">
        <div className="h-full w-[35%] rounded-full bg-primary" />
      </div>

      <style>{`@keyframes wave { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }`}</style>
    </Card>
  )
}
