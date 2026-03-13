import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const result = await genAI.models.embedContent({
    model: "gemini-embedding-2-preview",
    contents: text,
    config: {
      outputDimensionality: 768,
    },
  });

  const values = result.embeddings?.[0]?.values;

  if (!values) {
    throw new Error("No embeddings returned from Gemini");
  }

  return values;
};