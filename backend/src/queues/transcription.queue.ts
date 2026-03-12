import { Queue } from "bullmq";

const redisConnection = {
  host: '127.0.0.1',
  port: 6379
}

export const transcriptionQueue = new Queue('transcription', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  }
})

export const addTranscriptionJob = async (noteId: string, userId: string, file: any) => {
  return await transcriptionQueue.add('transcribe-audio', {
    noteId,
    userId,
    audioFile: file
  })
}

// setTimeout(() => {
//   addTranscriptionJob('test-note-123', 'test-user-456', 'test-audio.mp3')
// }, 5000)