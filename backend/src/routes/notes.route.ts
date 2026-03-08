import { Router} from "express";
import { createNote, getAllNotes, getNotesById } from "../controllers/notes.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";

const notesRouter = Router()

// Create note
notesRouter.post('/', authMiddleware, createNote)

//get all notes
notesRouter.get('/', authMiddleware, getAllNotes)

//get note by id
notesRouter.get('/:noteId', authMiddleware, getNotesById)


export default notesRouter