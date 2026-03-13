import { Router} from "express";
import { createNote, deleteNote, getAllNotes, getNoteAudio, getNotesById, serachNotes, updateNote, uploadAudio } from "../controllers/notes.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import { upload } from "../config/multer.ts";

const notesRouter = Router()

// Create note
notesRouter.post('/', authMiddleware, createNote)

//get all notes
notesRouter.get('/', authMiddleware, getAllNotes)

//search
notesRouter.get("/search", authMiddleware, serachNotes);

//get note by id
notesRouter.get('/:noteId', authMiddleware, getNotesById)

//update note by id
notesRouter.patch('/:noteId', authMiddleware, updateNote)

//delete note by id
notesRouter.delete('/:noteId', authMiddleware, deleteNote)

//upload audio 
notesRouter.post('/upload',authMiddleware, upload.single('audio'), uploadAudio)

notesRouter.get('/:id/audio', authMiddleware, getNoteAudio)

export default notesRouter