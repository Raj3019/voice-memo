export type SearchMode = "text" | "semantic";

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

export type NoteStatus = "uploading" | "processing" | "completed" | string;

export type Note = {
  id: string;
  title: string;
  description: string;
  transcript: string;
  status: NoteStatus;
  categoryId: string | null;
  categoryName: string;
  dayLabel: string;
  time: string;
  voice: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  notesCount?: number;
};

export type AudioFile = {
  id: string;
  noteId: string;
  userId: string;
  url: string;
  format: string;
  duration: number;
  createdAt: string;
};

export type PaginatedNotes = {
  data: Note[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type UserSession = {
  user: {
    id: string;
    name?: string;
    email: string;
    image?: string | null;
  };
};
