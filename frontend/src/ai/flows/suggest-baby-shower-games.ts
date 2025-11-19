'use server';
/**
 * @fileOverview Suggests baby shower game ideas.
 * Uses AI to reason about appropriateness of specific options given various parameters.
 */

import { ai, DEFAULT_MODEL } from '@/src/ai/genkit';
import { z } from 'zod';

const SuggestBabyShowerGamesInputSchema = z.object({
  guestPreferences: z
    .string()
    .describe('A description of the guests attending the baby shower, their ages, and their relationship to the parent(s).'),
  theme: z.string().describe('The theme of the baby shower.'),
});

export type SuggestBabyShowerGamesInput = z.infer<
  typeof SuggestBabyShowerGamesInputSchema
>;

const SuggestBabyShowerGamesOutputSchema = z.object({
  gameSuggestions: z
    .string()
    .describe('A list of baby shower game suggestions that are appropriate for the guests and the theme.'),
});

export type SuggestBabyShowerGamesOutput = z.infer<
  typeof SuggestBabyShowerGamesOutputSchema
>;

export async function suggestBabyShowerGames(
  input: SuggestBabyShowerGamesInput
): Promise<SuggestBabyShowerGamesOutput> {
  const prompt = `You are a party planning expert specializing in baby showers.

Suggest baby shower game ideas based on the guest preferences and the chosen theme.

Guest Preferences: ${input.guestPreferences}
Theme: ${input.theme}

Please suggest 5-7 appropriate games that:
1. Match the theme
2. Are suitable for the guest demographics
3. Are inclusive and fun for everyone
4. Include brief instructions or descriptions
5. Consider different activity levels and preferences

Format your response as a clear, organized list of game suggestions.`;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
    });

    return {
      gameSuggestions: response.text || 'Unable to generate game suggestions.',
    };
  } catch (error) {
    console.error('Error generating game suggestions:', error);
    throw new Error('Failed to generate game suggestions. Please try again.');
  }
}

