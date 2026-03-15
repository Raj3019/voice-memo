export type MockNote = {
  id: string
  title: string
  tag: string
  time: string
  dayLabel: string
  voice: boolean
  description: string
}

export const mockNotes: MockNote[] = [
  {
    id: "team-sync-q3",
    title: "Team sync ideas for Q3 product roadmap",
    tag: "Work",
    time: "2:34",
    dayLabel: "Today",
    voice: true,
    description:
      "Discussion about Q3 roadmap priorities, focusing on retention features, onboarding improvements, and search.",
  },
  {
    id: "grocery-weekend",
    title: "Grocery list & weekend errands reminder",
    tag: "Personal",
    time: "",
    dayLabel: "Yesterday",
    voice: false,
    description:
      "Buy groceries, schedule laundry pickup, and confirm weekend errands.",
  },
  {
    id: "lex-consciousness",
    title: "Podcast note: Lex Fridman on consciousness",
    tag: "Learning",
    time: "1:12",
    dayLabel: "Mon",
    voice: true,
    description:
      "Key points around consciousness, agency, and how models reason over long context.",
  },
  {
    id: "morning-reflection",
    title: "Morning reflection - felt really energised",
    tag: "Journal",
    time: "0:48",
    dayLabel: "Mon",
    voice: true,
    description:
      "Short reflection on morning routine and energy levels after a better sleep schedule.",
  },
  {
    id: "react-query-caching",
    title: "React query caching strategy",
    tag: "Work",
    time: "",
    dayLabel: "Sun",
    voice: false,
    description:
      "Compare stale time, query invalidation, and background refresh strategy for notes feed.",
  },
]
