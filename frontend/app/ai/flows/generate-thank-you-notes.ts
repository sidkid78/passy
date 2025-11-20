'use server';
/**
 * @fileOverview Generates thank you notes based on gifts received.
 *
 * - generateThankYouNotes - A function that generates thank you notes.
 * - GenerateThankYouNotesInput - The input type for the generateThankYouNotes function.
 * - GenerateThankYouNotesOutput - The return type for the generateThankYouNotes function.
 */

import { ai, DEFAULT_MODEL } from '@/app/ai/genkit';
import { z } from 'zod';

const GenerateThankYouNotesInputSchema = z.object({
  guestName: z.string().describe('The name of the guest who gave the gift.'),
  giftDescription: z.string().describe('A description of the gift received.'),
  personalNote: z.string().optional().describe('Any personal note or memory associated with the guest or gift.'),
  tone: z.enum(['formal', 'informal', 'humorous']).default('informal').describe('The desired tone of the thank you note.'),
});
export type GenerateThankYouNotesInput = z.infer<typeof GenerateThankYouNotesInputSchema>;

const GenerateThankYouNotesOutputSchema = z.object({
  thankYouNote: z.string().describe('The generated thank you note.'),
});
export type GenerateThankYouNotesOutput = z.infer<typeof GenerateThankYouNotesOutputSchema>;

export async function generateThankYouNotes(input: GenerateThankYouNotesInput): Promise<GenerateThankYouNotesOutput> {
  const prompt = `You are an expert at writing thank you notes. Generate a thank you note based on the gift received.

Guest Name: ${input.guestName}
Gift Description: ${input.giftDescription}
Personal Note: ${input.personalNote || 'N/A'}
Tone: ${input.tone}

Please write a heartfelt thank you note that:
1. Addresses the guest by name
2. Specifically mentions the gift
3. Expresses genuine gratitude
4. Includes any personal touches mentioned
5. Matches the requested tone (${input.tone})

Thank You Note:`;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
    });

    return {
      thankYouNote: response.text || 'Unable to generate thank you note.',
    };
  } catch (error) {
    console.error('Error generating thank you note:', error);
    throw new Error('Failed to generate thank you note. Please try again.');
  }
}

