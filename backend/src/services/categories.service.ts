import { categories} from "../db/schema.ts";
import { db } from "../db/index.ts";
import { eq } from "drizzle-orm";


export const createCategories = async(userId: string, categoryName: string) => {
  const category = await db.insert(categories).values({userId, categoryName}).returning()
  return category[0]
}

export const getCategories = async (userId:string) => {
  const getCategory = await db.select().from(categories).where(eq(categories.userId, userId))
  return getCategory
}