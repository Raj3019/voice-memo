import type { Request, Response } from "express";
import { createNote as createNoteService } from "../services/notes.service.ts";
import { getNotes as getNoteService } from "../services/notes.service.ts";
import { getNotesById as getNotesByIdService } from "../services/notes.service.ts";
import { updateNoteById as updateNotebyIdService } from "../services/notes.service.ts";
import { deleteNoteById as deleteNoteByIdService } from "../services/notes.service.ts";
import {getNoteAudio as getNoteAudioService} from "../services/notes.service.ts"
import { db } from "../db/index.ts";
import { audioFile, notes } from "../db/schema.ts";
import { compressAudio } from "../utils/compressAudio.ts";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.ts";
import { eq } from "drizzle-orm";
import { addTranscriptionJob } from "../queues/transcription.queue.ts";


export const createNote = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { title, description, categoryId } = req.body

    const note = await createNoteService(userId, title, description, categoryId)

    return res.status(201).json({ message: "Note created successfully", note })
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message === "Category not found or doesn't belong to you") {
      return res.status(403).json({ message: error.message })
    }
    return res.status(500).json({ message: "Something went wrong" })
  }
}

export const getAllNotes = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const categoryId = req.query.categoryId as string | undefined;
    const status = req.query.status as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const order = (req.query.order as string) || "desc";

    const result = await getNoteService(userId, {
      ...(categoryId && { categoryId }),
      ...(status && { status }),
      page,
      limit,
      sortBy,
      order
    });

    return res.status(200).json({ message: "All note feteched successfully", ...result, })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fetching Notes", error })
  }
}

export const getNotesById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const notesId = req.params.noteId as string
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (!notesId) {
      return res.status(400).json({ message: "Note ID is required" })
    }

    const getNote = await getNotesByIdService(userId, notesId)

    if (getNote.length === 0) {
      return res.status(404).json({ message: "No notes found" })
    }
    return res.status(200).json({ message: "Fetched the note successfully", getNote })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fetching Notes", error })
  }
}

export const updateNote = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const notesId = req.params.noteId as string
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (!notesId) {
      return res.status(400).json({ message: "Note ID is required" })
    }

    const { title, description, categoryId } = req.body

    const update = await updateNotebyIdService(userId, notesId, title, description, categoryId)

    return res.status(200).json({ message: "The note was updated successfully!", update })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "The note was unable to update", error })
  }
}


export const deleteNote = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const notesId = req.params.noteId as string
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (!notesId) {
      return res.status(400).json({ message: "Note ID is required" })
    }

    const deleted = await deleteNoteByIdService(userId, notesId)

    if (deleted.length === 0) {
      return res.status(404).json({ message: "Note not found or doesn't belong to you" })
    }

    return res.status(200).json({ message: "Note Deleted Successfully" })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Unable to delete the Note", error })
  }
}

export const uploadAudio = async (req: Request, res: Response) => {
  try {
    //1. check if file exists
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' })
    }

    const userId = req.user!.id // from middleware

    //2. create note in db first (status: 'uploading')
    const [note] = await db.insert(notes).values({
      userId,
      status: 'uploading',
    }).returning();

    if (!note) {
      return res.status(500).json({ error: 'Failed to create note' });
    }

    // 3. Compress audio
    let compressedBuffer: Buffer;
    let audioDuration: number;
    try {
      console.log('Compressing audio....');
      const result = await compressAudio(req.file.buffer);
      compressedBuffer = result.buffer;
      audioDuration = result.duration;
      console.log('Duration:', audioDuration, 'seconds');
    } catch (err) {
      // compression failed — delete the note we just created
      await db.delete(notes).where(eq(notes.id, note.id));
      return res.status(500).json({ error: 'Audio compression failed' });
    }

    // 4. Upload to Cloudinary
    let audioUrl: string;
    try {
      console.log('Uploading to cloudinary');
      audioUrl = await uploadToCloudinary(compressedBuffer, `audio-${note.id}`);
    } catch (err) {
      // upload failed — delete the note
      await db.delete(notes).where(eq(notes.id, note.id));
      return res.status(500).json({ error: 'Audio upload failed' });
    }

    //5. save audio file record in db
    await db.insert(audioFile).values({
      noteId: note.id,
      userId,
      url: audioUrl,
      format: 'mp3',
      duration: audioDuration
    })

    //6. update note status to 'processing'
    await db.update(notes)
      .set({ status: 'processing' })
      .where(eq(notes.id, note.id));

    // 7. Add job to queue — worker handles transcription
    await addTranscriptionJob(note.id, userId, audioUrl);

    // 8. Return response immediately — don't wait for transcription!
    return res.status(201).json({
      message: 'Audio uploaded successfully, transcription in progress',
      noteId: note.id,
      audioUrl,
      createdAt: note.createdAt
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}

export const getNoteAudio = async (req:Request, res: Response) => {
  try {
    const userId = req.user?.id
    const id = req.params.id as string

    if (!userId) {
      return res.status(401).json({success: false, message: "Unauthorized"})
    }

    const audioFiles = await getNoteAudioService (id, userId);

     if (audioFiles === null) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    return res.status(200).json({ success: true, data: audioFiles });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Failed to fetch audio files" });
  }
}