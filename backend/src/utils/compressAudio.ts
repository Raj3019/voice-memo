import { spawn, ChildProcess } from 'child_process';
import ffmpegStatic from 'ffmpeg-static';

export const compressAudio = (inputBuffer: Buffer): Promise<Buffer> => {
  return new Promise((resolve, reject) => {

    if (!ffmpegStatic) {
      return reject(new Error('FFmpeg binary not found'));
    }

    const chunks: Buffer[] = [];

    const ffmpegProcess: ChildProcess = spawn(ffmpegStatic as unknown as string, [
      '-i', 'pipe:0',
      '-b:a', '64k',
      '-ac', '1',
      '-ar', '16000',
      '-f', 'mp3',
      'pipe:1'
    ]);

    ffmpegProcess.stdout!.on('data', (chunk: Buffer) => chunks.push(chunk));
    ffmpegProcess.stdout!.on('end', () => resolve(Buffer.concat(chunks)));

    ffmpegProcess.on('error', reject);
    ffmpegProcess.stderr!.on('data', () => {});

    // Cast stdin to avoid TypeScript complaining
    ffmpegProcess.stdin!.write(inputBuffer);
    ffmpegProcess.stdin!.end();
  });
};