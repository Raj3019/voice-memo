import { createClient } from '@deepgram/sdk';

const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

export const transcribeAudio = async (audioUrl: string, language: string = 'en'): Promise<string> => {
  const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
    { url: audioUrl },
    {
      model: 'nova-2',
      language,
      smart_format: true,
    }
  );

  if (error) throw error;

  return result!.results!.channels![0]!.alternatives![0]!.transcript;
};