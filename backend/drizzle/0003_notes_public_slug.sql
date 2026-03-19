ALTER TABLE "notes" ADD COLUMN "public_slug" text;

UPDATE "notes"
SET "public_slug" = trim(
  BOTH '-' FROM lower(
    regexp_replace(coalesce(nullif("title", ''), 'note'), '[^a-zA-Z0-9]+', '-', 'g')
  )
) || '-' || substr(replace("id"::text, '-', ''), 1, 8)
WHERE "public_slug" IS NULL;

ALTER TABLE "notes" ALTER COLUMN "public_slug" SET NOT NULL;
CREATE UNIQUE INDEX "notes_public_slug_unique" ON "notes" ("public_slug");
