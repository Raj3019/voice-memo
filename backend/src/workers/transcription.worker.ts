import { Worker } from "bullmq";

const redisConnection = {
  host: '127.0.0.1',
  port: 6379
}

const transcriptionWorker = new Worker('transcription', async(job) => {
  console.log('Job received!', job.data);
  console.log('Job data:', job.data)
}, {
  connection: redisConnection
})

transcriptionWorker.on('ready', () => {
  console.log('🟢 Worker connected to Redis!')
})

transcriptionWorker.on('completed', (job) => {
  console.log('✅ Job completed!', job.id)
})

transcriptionWorker.on('failed', (job, err) => {
  console.log('❌ Job failed!', err)
})

transcriptionWorker.on('active', (job) => {
  console.log('🔄 Job active!', job.data)
})

transcriptionWorker.on('error', (err) => {
  console.log('🔴 Worker error!', err)
})

console.log('Worker is running and waiting for jobs...')
