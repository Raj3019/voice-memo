import { apiClient } from "@/lib/api/client";
import type { AxiosProgressEvent } from "axios";
import { formatDayLabel, formatDuration } from "@/lib/api/utils";
import { getCategories } from "@/lib/api/categories";
import type { AudioFile, Category, Note, PaginatedNotes, SearchMode } from "@/lib/types";

type NoteRow = {
  id: string;
  userId: string;
  categoryId: string | null;
  title: string | null;
  description: string | null;
  transcript: string | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
};

type NotesResponse = {
  data: NoteRow[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type NoteByIdResponse = {
  getNote: NoteRow[];
};

type SearchResponse = {
  data: NoteRow[];
};

type NoteAudioResponse = {
  data: AudioFile[];
};

type CategoryMap = Record<string, string>;
type NotesParams = {
  categoryId?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
};

const NOTES_CACHE_TTL_MS = 60_000;
const notesListCache = new Map<string, { data: PaginatedNotes; at: number }>();
const notesListPromiseCache = new Map<string, Promise<PaginatedNotes>>();
const noteDetailCache = new Map<string, { data: { note: Note; audioFiles: AudioFile[] } | null; at: number }>();

function buildCategoryMap(categories: Category[]): CategoryMap {
  return categories.reduce<CategoryMap>((acc, item) => {
    acc[item.id] = item.name;
    return acc;
  }, {});
}

function normalizeNote(row: NoteRow, categoryMap: CategoryMap, audioDuration?: number): Note {
  const categoryName = row.categoryId ? categoryMap[row.categoryId] || "Uncategorized" : "Uncategorized";

  return {
    id: row.id,
    title: row.title || "Untitled note",
    description: row.description || "",
    transcript: row.transcript || "",
    status: row.status,
    categoryId: row.categoryId,
    categoryName,
    dayLabel: formatDayLabel(row.createdAt),
    time: formatDuration(audioDuration),
    voice: Boolean((row.transcript && row.transcript.trim()) || audioDuration),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function getNotesCacheKey(params?: NotesParams) {
  return JSON.stringify(params || {});
}

export async function getNotes(params?: NotesParams) {
  const key = getNotesCacheKey(params);
  const now = Date.now();
  const cached = notesListCache.get(key);
  if (cached && now - cached.at < NOTES_CACHE_TTL_MS) {
    return cached.data;
  }

  const inFlight = notesListPromiseCache.get(key);
  if (inFlight) {
    return inFlight;
  }

  const request = Promise.all([
    apiClient.get<NotesResponse>("/api/notes", { params }),
    getCategories(),
  ]).then(([notesRes, categories]) => {
    const categoryMap = categories.reduce<CategoryMap>((acc, item) => {
      acc[item.id] = item.name;
      return acc;
    }, {});

    const normalized: PaginatedNotes = {
      data: notesRes.data.data.map((row) => normalizeNote(row, categoryMap)),
      meta: notesRes.data.meta,
    };

    notesListCache.set(key, { data: normalized, at: Date.now() });
    return normalized;
  }).finally(() => {
    notesListPromiseCache.delete(key);
  });

  notesListPromiseCache.set(key, request);
  return request;
}

export async function getNoteById(noteId: string, categories: Category[] = []) {
  const now = Date.now();
  const cached = noteDetailCache.get(noteId);
  if (cached && now - cached.at < NOTES_CACHE_TTL_MS) {
    return cached.data;
  }

  const categoryMap = buildCategoryMap(categories);
  const { data } = await apiClient.get<NoteByIdResponse>(`/api/notes/${noteId}`);
  const row = data.getNote[0];

  if (!row) {
    noteDetailCache.set(noteId, { data: null, at: Date.now() });
    return null;
  }

  const audioFiles = await getNoteAudio(noteId).catch(() => [] as AudioFile[]);
  const latestAudio = audioFiles[0];

  const normalized = {
    note: normalizeNote(row, categoryMap, latestAudio?.duration),
    audioFiles,
  };
  noteDetailCache.set(noteId, { data: normalized, at: Date.now() });
  return normalized;
}

export async function getNoteStatus(noteId: string) {
  const { data } = await apiClient.get<NoteByIdResponse>(`/api/notes/${noteId}`);
  return data.getNote[0]?.status || null;
}

export async function createNote(payload: {
  title: string;
  description: string;
  categoryId?: string;
}) {
  const { data } = await apiClient.post<{ note: NoteRow }>("/api/notes", payload);
  invalidateNotesCache();
  return data.note;
}

export async function updateNote(noteId: string, payload: { title: string; description: string; categoryId?: string }) {
  const { data } = await apiClient.patch<{ update: NoteRow[] }>(`/api/notes/${noteId}`, payload);
  invalidateNotesCache(noteId);
  return data.update[0];
}

export async function deleteNote(noteId: string) {
  await apiClient.delete(`/api/notes/${noteId}`);
  invalidateNotesCache(noteId);
}

export async function searchNotes(query: string, type: SearchMode = "text", categories: Category[] = []) {
  const categoryMap = buildCategoryMap(categories);
  const { data } = await apiClient.get<SearchResponse>("/api/notes/search", {
    params: { q: query, type },
  });

  return data.data.map((row) => normalizeNote(row, categoryMap));
}

export async function uploadNoteAudio(
  file: File,
  onUploadProgress?: (percent: number) => void
) {
  const formData = new FormData();
  formData.append("audio", file);

  const { data } = await apiClient.post<{ noteId: string; audioUrl: string }>("/api/notes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (event: AxiosProgressEvent) => {
      if (!onUploadProgress || !event.total) return;
      const percent = Math.round((event.loaded / event.total) * 100);
      onUploadProgress(percent);
    },
  });

  invalidateNotesCache();
  return data;
}

export async function getNoteAudio(noteId: string) {
  const { data } = await apiClient.get<NoteAudioResponse>(`/api/notes/${noteId}/audio`);
  return data.data || [];
}

export function invalidateNotesCache(noteId?: string) {
  notesListCache.clear();
  notesListPromiseCache.clear();
  if (noteId) {
    noteDetailCache.delete(noteId);
    return;
  }
  noteDetailCache.clear();
}
