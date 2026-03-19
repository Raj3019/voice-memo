DROP INDEX IF EXISTS "notes_public_slug_unique";

WITH base AS (
  SELECT
    n.id,
    n.user_id,
    COALESCE(
      NULLIF(
        trim(BOTH '-' FROM lower(regexp_replace(COALESCE(NULLIF(n.title, ''), 'note'), '[^a-zA-Z0-9]+', '-', 'g'))),
        ''
      ),
      'note'
    ) AS base_slug,
    n.created_at
  FROM "notes" n
),
ranked AS (
  SELECT
    b.id,
    b.user_id,
    b.base_slug,
    row_number() OVER (PARTITION BY b.user_id, b.base_slug ORDER BY b.created_at, b.id) AS rn
  FROM base b
)
UPDATE "notes" n
SET "public_slug" = CASE
  WHEN r.rn = 1 THEN r.base_slug
  ELSE r.base_slug || '-' || r.rn
END
FROM ranked r
WHERE n.id = r.id;

CREATE UNIQUE INDEX "notes_user_id_public_slug_unique" ON "notes" ("user_id", "public_slug");
