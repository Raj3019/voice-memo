import app from './app.ts'
import './workers/transcription.worker.ts'
import './queues/transcription.queue.ts'
import { compressAudio } from './utils/compressAudio.ts'
import fs from 'fs';

// const testBuffer = fs.readFileSync('./src/test.mp3')
// const compressed = await compressAudio(testBuffer)

// console.log('Original size:', testBuffer.length / 1024, 'KB');
// console.log('Compressed size:', compressed.length / 1024, 'KB');

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
