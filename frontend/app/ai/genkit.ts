import { GoogleGenAI } from '@google/genai';

// Initialize the Google GenAI SDK
const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.warn('GEMINI_API_KEY is not set. AI features will not work.');
}

export const ai = new GoogleGenAI({
  apiKey: apiKey || '',
});

// Default model to use
export const DEFAULT_MODEL = 'gemini-2.5-flash';

