import { and, asc, desc, eq, ilike, isNotNull, or, sql } from "drizzle-orm";
import { db } from "../db/index.ts";
import { audioFile, categories, notes } from "../db/schema.ts";
import { generateEmbedding } from "../utils/generateEmbedding.ts";
import { generateUniquePublicSlug } from "../utils/publicSlug.ts";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function byNoteIdentifier(noteIdentifier: string) {
  if (UUID_RE.test(noteIdentifier)) {
    return or(eq(notes.id, noteIdentifier), eq(notes.publicSlug, noteIdentifier));
  }
  return eq(notes.publicSlug, noteIdentifier);
}

function buildEmbeddingText(parts: Array<string | null | undefined>) {
  return parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(" ");
}

async function generateNoteEmbedding(parts: Array<string | null | undefined>) {
  const text = buildEmbeddingText(parts);
  if (!text) return null;

  try {
    return await generateEmbedding(text);
  } catch (error) {
    console.error("Embedding generation failed for note payload:", error);
    return null;
  }
}

export const createNote = async (userId: string, title: string, description: string, categoryId?: string) => {
  if (categoryId) {
    const category = await db.select().from(categories).where(
      and(eq(categories.id, categoryId), eq(categories.userId, userId))
    )

    if (category.length === 0) {
      throw new Error("Category not found or doesn't belong to you")
    }
  }
  const publicSlug = await generateUniquePublicSlug(userId, title)
  const embedding = await generateNoteEmbedding([title, description])
  const note = await db.insert(notes).values({
    userId,
    publicSlug,
    title,
    description,
    categoryId,
    embedding,
    status: "completed",
  }).returning()
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

export const getNotesById = async (userId: string, noteIdentifier: string) => {
  const getNote = await db
    .select()
    .from(notes)
    .where(
      and(
        eq(notes.userId, userId),
        byNoteIdentifier(noteIdentifier)
      )
    )
  return getNote
}

export const updateNoteById = async (userId: string, noteIdentifier: string, title: string, description: string, categoryId?: string) => {
  const existingNote = await db
    .select({
      title: notes.title,
      description: notes.description,
      transcript: notes.transcript,
    })
    .from(notes)
    .where(
      and(
        eq(notes.userId, userId),
        byNoteIdentifier(noteIdentifier)
      )
    )
    .limit(1)

  if (existingNote.length === 0) {
    return []
  }

  const nextTitle = title ?? existingNote[0]!.title
  const nextDescription = description ?? existingNote[0]!.description
  const embedding = await generateNoteEmbedding([
    nextTitle,
    nextDescription,
    existingNote[0]!.transcript,
  ])

  const updateNote = await db
    .update(notes)
    .set({ title, description, categoryId, embedding })
    .where(
      and(
        eq(notes.userId, userId),
        byNoteIdentifier(noteIdentifier)
      )
    )
    .returning()
  return updateNote
}

export const deleteNoteById = async (userId: string, noteIdentifier: string) => {
  const deleteNote = await db
    .delete(notes)
    .where(
      and(
        eq(notes.userId, userId),
        byNoteIdentifier(noteIdentifier)
      )
    )
    .returning()
  return deleteNote
}

export const getNoteAudio = async (noteIdentifier: string, userId: string) => {
  const note = await db
    .select()
    .from(notes)
    .where(
      and(
        eq(notes.userId, userId),
        byNoteIdentifier(noteIdentifier)
      )
    )
    .limit(1)

  if (note.length === 0) {
    return null
  }

  const audioFiles = await db
    .select()
    .from(audioFile)
    .where(eq(audioFile.noteId, note[0]!.id))
    .orderBy(desc(audioFile.createdAt))
  return audioFiles;
}

export const searchNotes = async (userId: string, query: string, type: string) => {
  const normalizedQuery = query.trim();

  const runTextSearch = async () => {
    return await db
      .select()
      .from(notes)
      .where(
        and(
          eq(notes.userId, userId),
          or(
            ilike(notes.title, `%${normalizedQuery}%`),
            ilike(notes.transcript, `%${normalizedQuery}%`)
          )
        )
      )
      .orderBy(desc(notes.createdAt))
      .limit(10);
  }

  //Regular text search
  if (type === 'text') {
    return await runTextSearch();
  }

  // Very short queries behave poorly with embeddings, especially acronyms like "bca".
  // Treat them as keyword search instead of forcing nearest-neighbor matches.
  if (normalizedQuery.length <= 3) {
    return await runTextSearch();
  }

  // Semantic search (default)
  const queryEmbedding = await generateEmbedding(normalizedQuery);
  const vectorString = `[${queryEmbedding.join(',')}]`;

  const results = await db
    .select()
    .from(notes)
    .where(
      and(
        eq(notes.userId, userId),
        eq(notes.status, "completed"),
        isNotNull(notes.embedding)
      )
    )
    .orderBy(sql`embedding <=> ${vectorString}::vector`)
    .limit(10);

  return results;
};
