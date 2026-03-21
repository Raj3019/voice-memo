import { Worker } from "bullmq";
import { transcribeAudio } from "../utils/transcribe.ts";
import { db } from "../db/index.ts";
import { notes } from "../db/schema.ts";
import { eq } from "drizzle-orm";
import { generateNoteContent } from "../utils/generateNoteContent.ts";
import { generateEmbedding } from "../utils/generateEmbedding.ts";

const redisConnection = {
  host: '127.0.0.1',
  port: 6379
}

const transcriptionWorker = new Worker('transcription', async(job) => {
  const {noteId, audioFile} = job.data
  
  console.log('🎙️ Starting transcription for note:', noteId);

  // 1. Transcribe the audio — critical step, retry if fails
  let transcript: string;
  let transcriptTimestamps: { text: string; start: number; end: number }[] = [];
  try {
    const transcription = await transcribeAudio(audioFile);
    transcript = transcription.transcript;
    transcriptTimestamps = transcription.timestamps;
    console.log('📝 Transcript received:', transcript.slice(0, 100) + '...');
  } catch (err) {
    console.error('❌ Transcription failed:', err);
    // mark note as failed so user knows something went wrong
      if (job.attemptsMade >= (job.opts.attempts ?? 1) - 1) {
    await db.update(notes)
      .set({ status: 'failed', updatedAt: new Date() })
      .where(eq(notes.id, noteId));
  }
  throw err
}

  // 2. Generate title + description — not critical, soft failure
  let title = null;
  let description = null;
  let embedding = null;
  try {
    const generated = await generateNoteContent(transcript);
    title = generated.title;
    description = generated.description;
    console.log('✨ Generated title:', title);
    console.log('📄 Generated description:', description);
  } catch (err) {
    // Groq failed — no worries, we still have transcript
    // title and description stay null
    console.error('⚠️ Title/description generation failed, saving transcript only:', err);
  }

  try {
    const textToEmbed = [title, description, transcript]
      .map((part) => part?.trim())
      .filter((part): part is string => Boolean(part))
      .join(' ')
    embedding = await generateEmbedding(textToEmbed)
    console.log('Embedding generated successfully!');
  } catch (error) {
    console.error('Embedding generation failed, saving without embedding:', error);
  }

  // 3. Update note with everything we have
  await db.update(notes)
    .set({
      transcript,
      transcriptTimestamps,
      title,
      description,
      embedding,
      status: 'completed',
      updatedAt: new Date()
    })
    .where(eq(notes.id, noteId));

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
