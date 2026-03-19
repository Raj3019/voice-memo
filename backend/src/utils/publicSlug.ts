import { and, eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { notes } from "../db/schema.ts";

function slugify(input?: string | null) {
  const value = (input || "note")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return value || "note";
}

export async function generateUniquePublicSlug(userId: string, input?: string | null) {
  const base = slugify(input);
  let candidate = base;
  let count = 2;

  while (true) {
    const exists = await db
      .select({ id: notes.id })
      .from(notes)
      .where(and(eq(notes.userId, userId), eq(notes.publicSlug, candidate)))
      .limit(1);

    if (exists.length === 0) {
      return candidate;
    }

    candidate = `${base}-${count}`;
    count += 1;
  }
}
