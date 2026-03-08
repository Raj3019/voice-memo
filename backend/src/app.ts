import express from 'express'
import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth.ts";
import notesRouter from './routes/notes.route.ts';
import categoryRouter from './routes/categories.route.ts';


const app = express()

app.use(express.json())
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use('/api/notes', notesRouter)
app.use('/api/category', categoryRouter)

app.get('/', (req, res) => {
  res.send('Hello World raj')
})

export default app

