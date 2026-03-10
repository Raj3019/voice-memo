import { and, eq } from "drizzle-orm";
import { categories } from "../db/schema.ts";
import { db } from "../db/index.ts";


export const createCategories = async (userId: string, categoryName: string) => {
  const category = await db.insert(categories).values({ userId, categoryName }).returning()
  return category[0]
}

export const getCategories = async (userId: string) => {
  const getCategory = await db.select().from(categories).where(eq(categories.userId, userId))
  return getCategory
}

export const updateCategories = async (userId: string, categoryId: string, categoryName: string) => {
  const update = await db
    .update(categories)
    .set({ categoryName })
    .where(and(eq(categories.userId, userId), eq(categories.id, categoryId)))
    .returning()
  return update
}

export const deleteCategory = async (userId: string, categoryId: string) => {
  const deleted = await db
    .delete(categories)
    .where(and(eq(categories.userId, userId), eq(categories.id, categoryId)))
    .returning()
  return deleted
}
