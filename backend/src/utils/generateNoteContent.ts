import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!
});

interface GeneratedContent {
  title: string;
  description: string;
}

export const generateNoteContent = async (transcript: string): Promise<GeneratedContent> => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant that analyzes voice memo transcripts.
        Given a transcript, generate:
        1. A short, catchy title and sensible that is realted to transcripts only(max 6 words)
        2. A brief description/summary (max 2 sentences)
        
        Respond ONLY in this JSON format, nothing else:
        {
          "title": "your title here",
          "description": "your description here"
        }`
      },
      {
        role: 'user',
        content: `Generate a title and description for this transcript: ${transcript}`
      }
    ],
    temperature: 0.7,
  });

  const content = response.choices[0]!.message.content!;
  const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed: GeneratedContent = JSON.parse(cleaned);

  return parsed;
};