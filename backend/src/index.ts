import app from './app.ts'
import './workers/transcription.worker.ts'
import './queues/transcription.queue.ts'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
