export function buildNotePath(noteSlug: string) {
  return `/notes/${noteSlug}`
}

export function buildEditNotePath(noteSlug: string) {
  return `${buildNotePath(noteSlug)}/edit`
}
