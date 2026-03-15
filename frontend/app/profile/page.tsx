import { ChevronRight, LogOut, Settings, Shield, Star } from "lucide-react"
import type { ReactNode } from "react"

import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type SettingItemProps = {
  title: string
  subtitle: string
  icon: ReactNode
  highlight?: boolean
}

function SettingItem({ title, subtitle, icon, highlight = false }: SettingItemProps) {
  return (
    <Card className={`flex items-center justify-between rounded-3xl border p-4 ${highlight ? "border-primary/35 bg-primary/8" : "border-border/70"}`}>
      <div className="flex items-center gap-3">
        <span className={`inline-flex size-10 items-center justify-center rounded-xl ${highlight ? "bg-primary text-primary-foreground" : "bg-muted text-[#8488A6]"}`}>
          {icon}
        </span>
        <div>
          <p className={`text-xl font-semibold ${highlight ? "text-primary" : "text-[#111333] dark:text-[#F7EBDD]"}`}>{title}</p>
          <p className="text-sm text-[#A2A5BE]">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="size-4 text-[#A2A5BE]" />
    </Card>
  )
}

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#D9D6CF] dark:bg-[#060A14]">
      <section className="mx-auto min-h-screen w-full max-w-sm bg-[#EAE8E2] dark:bg-[#0B1220]">
        <div className="border-b border-border/60 bg-[#F6F5F2] px-5 pb-4 pt-7 dark:bg-[#101522]">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#D59544] text-3xl font-bold text-white">A</div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#0B0B34] dark:text-[#FFF4E8]">Alex Rivera</h1>
              <p className="text-base text-[#5C607E] dark:text-[#AAB0D2]">alex@example.com</p>
            </div>
          </div>

          <Card className="grid grid-cols-3 rounded-3xl border-border/70">
            <div className="px-2 py-3 text-center">
              <p className="text-3xl font-bold text-[#101235] dark:text-[#F7EBDD]">45</p>
              <p className="text-xs text-[#A1A4BF]">Notes</p>
            </div>
            <div className="border-x border-border/70 px-2 py-3 text-center">
              <p className="text-3xl font-bold text-[#101235] dark:text-[#F7EBDD]">5</p>
              <p className="text-xs text-[#A1A4BF]">Categories</p>
            </div>
            <div className="px-2 py-3 text-center">
              <p className="text-2xl font-bold text-[#101235] dark:text-[#F7EBDD]">28 min</p>
              <p className="text-xs text-[#A1A4BF]">Recorded</p>
            </div>
          </Card>
        </div>

        <div className="space-y-3 bg-[#EAE8E2] px-5 pb-24 pt-4 dark:bg-[#0B1220]">
          <SettingItem icon={<Settings className="size-5" />} subtitle="Themes, language, defaults" title="Preferences" />
          <SettingItem icon={<Settings className="size-5" />} subtitle="Reminders and alerts" title="Notifications" />
          <SettingItem icon={<Shield className="size-5" />} subtitle="Password & biometrics" title="Security" />
          <SettingItem highlight icon={<Star className="size-5" />} subtitle="Unlimited AI processing" title="Upgrade to Pro" />
          <SettingItem icon={<Settings className="size-5" />} subtitle="Get support" title="Help & FAQ" />

          <Button className="mt-2 h-12 w-full rounded-2xl border border-primary/35 bg-transparent text-primary hover:bg-primary/8" variant="outline">
            <LogOut className="size-4" /> Sign Out
          </Button>
        </div>
      </section>

      <MobileBottomNav />
    </main>
  )
}
