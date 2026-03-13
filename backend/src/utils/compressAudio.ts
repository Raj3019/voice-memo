import { spawn, ChildProcess } from 'child_process';
import ffmpegStatic from 'ffmpeg-static';

export const compressAudio = (inputBuffer: Buffer): Promise<{ buffer: Buffer, duration: number }> => {
  return new Promise((resolve, reject) => {

    if (!ffmpegStatic) {
      return reject(new Error('FFmpeg binary not found'));
    }

    const chunks: Buffer[] = [];
    let duration = 0;

    const ffmpegProcess: ChildProcess = spawn(ffmpegStatic as unknown as string, [
      '-i', 'pipe:0',
      '-b:a', '64k',
      '-ac', '1',
      '-ar', '16000',
      '-f', 'mp3',
      'pipe:1'
    ]);

    ffmpegProcess.stdout!.on('data', (chunk: Buffer) => chunks.push(chunk));
    ffmpegProcess.stdout!.on('end', () => resolve({
      buffer: Buffer.concat(chunks),
      duration
    }));

    ffmpegProcess.stderr!.on('data', (data: Buffer) => {
      const output = data.toString();
      // console.log('FFmpeg stderr:', output);

      // FFmpeg prints duration like: "Duration: 00:01:23.45"
      const timeMatch = output.match(/time=(\d+):(\d+):(\d+\.\d+)/);
      if (timeMatch) {
        const hours = parseInt(timeMatch[1] || '0');
        const minutes = parseInt(timeMatch[2] || '0');
        const seconds = parseFloat(timeMatch[3] || '0');
        duration = Math.round((hours * 3600) + (minutes * 60) + seconds);
      }
    });

    ffmpegProcess.on('error', reject);

    // Cast stdin to avoid TypeScript complaining
    ffmpegProcess.stdin!.write(inputBuffer);
    ffmpegProcess.stdin!.end();
  });
};