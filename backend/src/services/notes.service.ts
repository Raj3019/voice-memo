import { and, eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { categories, notes } from "../db/schema.ts";

export const createNote = async (userId: string, title: string, description: string, categoryId?: string) => {
  if (categoryId) {
    const category = await db.select().from(categories).where(
      and(eq(categories.id, categoryId), eq(categories.userId, userId))
    )

    if (category.length === 0) {
      throw new Error("Category not found or doesn't belong to you")
    }
  }
  const note = await db.insert(notes).values({ userId, title, description, categoryId, status: "completed" }).returning()
  return note[0]
}

export const getNotes = async (userId: string) => {
  const getNotes = await db.select().from(notes).where(eq(notes.userId, userId))
  return getNotes
}

export const getNotesById = async (userId: string, noteId: string) => {
  const getNote = await db.select().from(notes).where(and(eq(notes.userId, userId), eq(notes.id, noteId)))
  return getNote
}

