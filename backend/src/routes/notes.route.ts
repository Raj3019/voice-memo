import { Router} from "express";
import { createNote, deleteNote, getAllNotes, getNotesById, updateNote } from "../controllers/notes.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";

const notesRouter = Router()

// Create note
notesRouter.post('/', authMiddleware, createNote)

//get all notes
notesRouter.get('/', authMiddleware, getAllNotes)

//get note by id
notesRouter.get('/:noteId', authMiddleware, getNotesById)

//update note by id
notesRouter.patch('/:noteId', authMiddleware, updateNote)

//delete note by id
notesRouter.delete('/:noteId', authMiddleware, deleteNote)

export default notesRouter