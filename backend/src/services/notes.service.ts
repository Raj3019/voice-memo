import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../db/index.ts";
import { audioFile, categories, notes } from "../db/schema.ts";
import { generateEmbedding } from "../utils/generateEmbedding.ts";

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

export const getNotes = async (userId: string, filters: {
  categoryId?: string, status?: string, page?: number, limit?: number, sortBy?: string;
  order?: string;
}) => {
  const page = filters.page ?? 1
  const limit = filters.limit ?? 10;
  const offset = (page - 1) * limit

  const conditions = [eq(notes.userId, userId)]

  if (filters.categoryId) conditions.push(eq(notes.categoryId, filters.categoryId))
  if (filters.status) conditions.push(eq(notes.status, filters.status))
  //const getNotes = await db.select().from(notes).where(eq(notes.userId, userId))
  //return getNotes
  // const allNotes = await db.select().from(notes).where(and(...filters))

  const sortColumn = filters.sortBy === "title"
    ? notes.title
    : filters.sortBy === "updatedAt"
      ? notes.updatedAt
      : notes.createdAt

  const sortOrder = filters.order === "asc" ? asc(sortColumn) : desc(sortColumn);

  const data = await db
    .select()
    .from(notes)
    .where(and(...conditions))
    .limit(limit)
    .offset(offset)
    .orderBy(sortOrder);

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(notes)
    .where(and(...conditions));

  const total = Number(countResult[0]?.count ?? 0)
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit),
    },
  };
}

export const getNotesById = async (userId: string, noteId: string) => {
  const getNote = await db.select().from(notes).where(and(eq(notes.userId, userId), eq(notes.id, noteId)))
  return getNote
}

export const updateNoteById = async (userId: string, noteId: string, title: string, description: string, categoryId?: string) => {
  const updateNote = await db.update(notes).set({ title, description, categoryId }).where(and(eq(notes.id, noteId), eq(notes.userId, userId))).returning()
  return updateNote
}

export const deleteNoteById = async (userId: string, noteId: string) => {
  const deleteNote = await db.delete(notes).where(and(eq(notes.userId, userId), eq(notes.id, noteId))).returning()
  return deleteNote
}

export const getNoteAudio = async (noteId: string, userId: string) => {
  const note = await db.select().from(notes).where(and(eq(notes.id, noteId), eq(notes.userId, userId))).limit(1)

  if (note.length === 0) {
    return null
  }

  const audioFiles = await db.select().from(audioFile).where(eq(audioFile.noteId, noteId)).orderBy(desc(audioFile.createdAt))
  return audioFiles;
}

export const searchNotes = async (userId: string, query: string, type: string) => {

  //Regular text search
  if (type === 'text') {
    const results = await db
      .select()
      .from(notes)
      .where(
        and(
          eq(notes.userId, userId),
          or(
            ilike(notes.title, `%${query}%`),
            ilike(notes.transcript, `%${query}%`)
          )
        )
      )
      .orderBy(desc(notes.createdAt))
      .limit(10);

    return results;
  }

  // Semantic search (default)
  const queryEmbedding = await generateEmbedding(query);
  const vectorString = `[${queryEmbedding.join(',')}]`;

  const results = await db
    .select()
    .from(notes)
    .where(and(eq(notes.userId, userId)))
    .orderBy(sql`embedding <=> ${vectorString}::vector`)
    .limit(10);

  return results;
};