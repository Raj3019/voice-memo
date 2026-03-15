import { Mic } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type NoteListCardProps = {
  title: string
  tag: string
  time: string
  dayLabel?: string
  voice?: boolean
  className?: string
}

export function NoteListCard({ title, tag, time, dayLabel, voice = false, className }: NoteListCardProps) {
  return (
    <Card className={cn("gap-0 rounded-3xl border-border/70 bg-card px-[18px] py-[15px] shadow-[0_4px_12px_rgba(20,20,30,0.04)]", className)}>
      <div className="mb-2.5 flex items-start justify-between gap-3">
        <h3 className="max-w-[72%] font-serif text-[1.08rem] font-semibold leading-[1.38] text-[#101235] dark:text-[#F7EBDD]">
          {title}
        </h3>
        <div className="flex shrink-0 items-center gap-1 pt-1 text-[11px] text-[#ACADC4]">
          {voice ? <Mic className="size-3 text-primary" /> : null}
          <span>{dayLabel}</span>
        </div>
      </div>

      <div className="mt-0.5 flex items-center gap-1.5">
        <Badge className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.8rem] font-medium text-primary hover:bg-primary/10">
          {tag}
        </Badge>
        <span className="text-[0.8rem] text-[#A4A7C0]">{time}</span>
      </div>
    </Card>
  )
}
