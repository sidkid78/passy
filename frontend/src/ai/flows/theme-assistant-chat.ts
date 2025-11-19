'use server';

import { ai, DEFAULT_MODEL } from '@/src/ai/genkit';
import { z } from 'zod';

const HistoryMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ThemeAssistantChatInputSchema = z.object({
  prompt: z.string().describe("The user's latest message in the conversation."),
  history: z.array(HistoryMessageSchema).optional().describe('The conversation history.'),
});
export type ThemeAssistantChatInput = z.infer<typeof ThemeAssistantChatInputSchema>;

const ThemeAssistantChatOutputSchema = z.object({
  response: z.string().describe("The AI's response to the user."),
  imagePrompt: z.string().optional().describe("A prompt to generate an image of the theme idea."),
  imageUrl: z.string().optional().describe("The generated image URL if an image was created."),
});
export type ThemeAssistantChatOutput = z.infer<typeof ThemeAssistantChatOutputSchema>;

export async function themeAssistantChat(
  input: ThemeAssistantChatInput
): Promise<ThemeAssistantChatOutput> {
  const systemPrompt = 'You are a friendly and creative baby shower theme planner. When discussing theme ideas, be descriptive and visual.';
  const conversationHistory = input.history?.map(msg => 
    `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
  ).join('\n\n') || '';
  const fullPrompt = `${systemPrompt}\n${conversationHistory ? `Conversation:\n${conversationHistory}\n\n` : ''}User: ${input.prompt}\n\nAssistant:`;

  try {
    // Generate text response
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: fullPrompt,
    });
    
    const textResponse = response.text || 'Unable to respond.';
    
    // Check if we should generate an image (when describing a detailed theme)
    // Trigger when response mentions decor, colors, or is a substantial theme description
    const lowerResponse = textResponse.toLowerCase();
    const hasThemeKeywords = lowerResponse.includes('theme') || 
                             lowerResponse.includes('decor') || 
                             lowerResponse.includes('color') ||
                             lowerResponse.includes('centerpiece') ||
                             lowerResponse.includes('idea');
    const shouldGenerateImage = hasThemeKeywords && 
                                textResponse.length > 300 && 
                                input.history && 
                                input.history.length >= 1;
    
    console.log('[Theme Assistant] Should generate image:', shouldGenerateImage, {
      hasThemeKeywords,
      responseLength: textResponse.length,
      historyLength: input.history?.length || 0
    });
    
    let imageUrl: string | undefined;
    let imagePrompt: string | undefined;
    
    if (shouldGenerateImage) {
      try {
        console.log('[Theme Assistant] Generating image prompt...');
        
        // Create a concise image prompt from the conversation
        const imagePromptResponse = await ai.models.generateContent({
          model: DEFAULT_MODEL,
          contents: `Based on this baby shower theme conversation, create a single, concise visual description (max 80 words) for an AI image generator. Focus ONLY on the visual scene - colors, decorations, atmosphere, lighting, flowers, centerpieces:\n\n${textResponse.substring(0, 600)}`,
        });
        
        imagePrompt = imagePromptResponse.text?.trim() || undefined;
        console.log('[Theme Assistant] Image prompt created:', imagePrompt?.substring(0, 100));
        
        if (imagePrompt) {
          // Generate image using Imagen
          console.log('[Theme Assistant] Calling Imagen API...');
          const imageResult = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `Beautiful elegant baby shower party scene: ${imagePrompt}. Soft natural lighting, elegant table settings, pastel decorations, welcoming warm atmosphere. Professional event photography, high quality, detailed.`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
          });
          
          console.log('[Theme Assistant] Imagen result:', {
            hasImages: !!imageResult.generatedImages,
            imageCount: imageResult.generatedImages?.length || 0
          });
          
          if (imageResult.generatedImages && imageResult.generatedImages.length > 0) {
            const firstImage = imageResult.generatedImages[0];
            if (firstImage?.image?.imageBytes) {
              // Convert raw bytes to base64 data URL (direct conversion without Buffer)
              imageUrl = `data:image/jpeg;base64,${firstImage.image.imageBytes}`;
              console.log('[Theme Assistant] ✅ Image generated successfully');
            }
          }
        }
      } catch (imageError) {
        console.error('[Theme Assistant] ❌ Error generating theme image:', imageError);
        // Continue without image if generation fails
      }
    }
    
    return { 
      response: textResponse,
      imagePrompt,
      imageUrl,
    };
  } catch (error) {
    console.error('Error in theme assistant chat:', error);
    throw new Error('Failed to get response. Please try again.');
  }
}
