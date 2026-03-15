export type MockCategory = {
  name: string
  slug: string
  notes: number
  color: string
  bubble: string
}

export const mockCategories: MockCategory[] = [
  { name: "Work", slug: "work", notes: 12, color: "#E07A5F", bubble: "bg-[#F5E3DE]" },
  { name: "Personal", slug: "personal", notes: 8, color: "#6C9F8F", bubble: "bg-[#DFECE7]" },
  { name: "Learning", slug: "learning", notes: 15, color: "#D8B06C", bubble: "bg-[#EFE8DA]" },
  { name: "Journal", slug: "journal", notes: 6, color: "#8A79D6", bubble: "bg-[#E9E3F8]" },
  { name: "Ideas", slug: "ideas", notes: 4, color: "#5EAFC8", bubble: "bg-[#DCEFF5]" },
]

export function getCategoryBySlug(slug: string) {
  return mockCategories.find((category) => category.slug === slug)
}
