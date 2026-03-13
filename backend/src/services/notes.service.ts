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

export const getNotes = async (userId: string, categoryId?: string, status?: string) => {
  const filters = [eq(notes.userId, userId)]

  if(categoryId) filters.push(eq(notes.categoryId, categoryId))
  if(status) filters.push(eq(notes.status, status))
  //const getNotes = await db.select().from(notes).where(eq(notes.userId, userId))
  //return getNotes
  const allNotes = await db.select().from(notes).where(and(...filters))
  return allNotes
}

export const getNotesById = async (userId: string, noteId: string) => {
  const getNote = await db.select().from(notes).where(and(eq(notes.userId, userId), eq(notes.id, noteId)))
  return getNote
}

export const updateNoteById = async (userId: string, noteId: string, title: string, description: string, categoryId?: string) => {
  const updateNote = await db.update(notes).set({ title, description, categoryId }).where(and(eq(notes.id, noteId), eq(notes.userId, userId))).returning()
  return updateNote
}

export const deleteNoteById = async(userId: string, noteId: string) => {
  const deleteNote = await db.delete(notes).where(and(eq(notes.userId, userId), eq(notes.id, noteId))).returning()
  return deleteNote
}