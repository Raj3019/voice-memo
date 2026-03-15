"use client"

import { ThemeToggle } from "@/components/theme-toggle"

export function GlobalThemeToggle() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-2 z-50">
      <div className="mx-auto flex w-full max-w-sm justify-end px-2">
        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
