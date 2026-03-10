import type { Request, Response } from "express";
import { createNote as createNoteService } from "../services/notes.service.ts";
import { getNotes as getNoteService } from "../services/notes.service.ts";
import { getNotesById as getNotesByIdService } from "../services/notes.service.ts";
import { updateNoteById as updateNotebyIdService } from "../services/notes.service.ts";
import { deleteNoteById as deleteNoteByIdService } from "../services/notes.service.ts";


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

    const allNotes = await getNoteService(userId)

    return res.status(200).json({ message: "All note feteched successfully", allNotes })
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

export const updateNote = async(req: Request, res: Response) => {
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

    const update = await updateNotebyIdService(userId, notesId, title, description, categoryId )

    return res.status(200).json({message: "The note was updated successfully!", update})

  } catch (error) {
    console.log(error)
    return res.status(500).json({message: "The note was unable to update", error})
  }
}


export const deleteNote = async(req: Request, res: Response) => {
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

    return res.status(200).json({message: "Note Deleted Successfully"})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: "Unable to delete the Note", error})
  }
}