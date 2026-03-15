import type { ReactNode } from "react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type MobileShellProps = {
  children: ReactNode
  className?: string
}

export function MobileShell({ children, className }: MobileShellProps) {
  return (
    <Card
      className={cn(
        "relative mx-auto min-h-[820px] w-full max-w-[430px] overflow-hidden rounded-[46px] border border-border/70 bg-background px-6 py-7 shadow-[0_26px_70px_rgba(0,0,0,0.08)] dark:shadow-[0_32px_90px_rgba(0,0,0,0.6)]",
        className
      )}
    >
      <div className="mb-9 flex items-center justify-center gap-2">
        <span className="h-2 w-2 rounded-full bg-muted-foreground/35" />
        <span className="h-1.5 w-10 rounded-full bg-muted-foreground/35" />
      </div>
      {children}
    </Card>
  )
}
