import { uuid, text, unique, timestamp, pgTable, varchar, integer, vector, jsonb } from "drizzle-orm/pg-core"

type TranscriptTimestamp = {
  text: string
  start: number
  end: number
}

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => new Date())
})

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  categoryName: text('category_name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  unique().on(table.userId, table.categoryName)
])

export const notes = pgTable('notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  publicSlug: text('public_slug').notNull(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'cascade' }),
  title: text('title'),
  description: text('description'),
  transcript: text('transcript'),
  transcriptTimestamps: jsonb('transcript_timestamps').$type<TranscriptTimestamp[]>(),
  status: text('status').notNull().default('uploading'),
  embedding: vector('embedding', {dimensions: 768 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => new Date())
}, (table) => [
  unique().on(table.userId, table.publicSlug),
])

export const audioFile = pgTable('audio_files', {
  id: uuid('id').defaultRandom().primaryKey(),
  noteId: uuid('note_id').references(() => notes.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  format: text('format').notNull(),
  duration: integer('duration').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
