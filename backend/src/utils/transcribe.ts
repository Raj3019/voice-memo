import { createClient } from '@deepgram/sdk';

const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

export type TranscriptTimestamp = {
  text: string;
  start: number;
  end: number;
};

export type TranscriptResult = {
  transcript: string;
  timestamps: TranscriptTimestamp[];
};

export const transcribeAudio = async (audioUrl: string, language: string = 'en'): Promise<TranscriptResult> => {
  const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
    { url: audioUrl },
    {
      model: 'nova-2',
      language,
      smart_format: true,
    }
  );

  if (error) throw error;

  const alternative = result?.results?.channels?.[0]?.alternatives?.[0];
  const transcript = alternative?.transcript ?? "";
  const words = alternative?.words ?? [];

  const timestamps: TranscriptTimestamp[] = words
    .map((word) => {
      const token = word as unknown as Record<string, unknown>;
      return {
        text: (typeof token.punctuated_word === "string" ? token.punctuated_word : token.word) as string || "",
        start: Number(token.start ?? 0),
        end: Number(token.end ?? 0),
      };
    })
    .filter((token) => token.text && Number.isFinite(token.start) && Number.isFinite(token.end));

  return { transcript, timestamps };
};
