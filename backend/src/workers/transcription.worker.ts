import { Worker } from "bullmq";
import { transcribeAudio } from "../utils/transcribe.ts";
import { db } from "../db/index.ts";
import { notes } from "../db/schema.ts";
import { eq } from "drizzle-orm";

const redisConnection = {
  host: '127.0.0.1',
  port: 6379
}

const transcriptionWorker = new Worker('transcription', async(job) => {
  const {noteId, audioFile} = job.data
  
  console.log('🎙️ Starting transcription for note:', noteId);

  // 1. Transcribe the audio
  const transcript  = await transcribeAudio(audioFile)

  console.log('📝 Transcript received:', transcript.slice(0, 100) + '...');

  // 2. Update note in DB — save transcript + mark as completed
  await db.update(notes)
  .set({
    transcript,
    status: 'completed',
    updatedAt: new Date()
  })
  .where(eq(notes.id, noteId)
)

console.log('✅ Note updated successfully!');

}, {
  connection: redisConnection
})

transcriptionWorker.on('ready', () => console.log('🟢 Worker connected to Redis!'))
transcriptionWorker.on('completed', (job) => console.log('✅ Job completed!', job.id))
transcriptionWorker.on('failed', (job, err) => console.log('❌ Job failed!', err))
transcriptionWorker.on('active', (job) => console.log('🔄 Job active!', job.data))
transcriptionWorker.on('error', (err) => console.log('🔴 Worker error!', err))


console.log('Worker is running and waiting for jobs...')
