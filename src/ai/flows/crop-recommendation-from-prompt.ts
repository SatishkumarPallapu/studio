'use server';
/**
 * @fileOverview A crop recommendation AI agent that takes a text prompt as input.
 *
 * - cropRecommendationFromPrompt - A function that handles the crop recommendation process.
 * - CropRecommendationFromPromptInput - The input type for the cropRecommendationFromPrompt function.
 * - CropRecommendationFromPromptOutput - The return type for the cropRecommendationFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropRecommendationFromPromptInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A text prompt describing the farmer location, soil type, and desired yield.'
    ),
});
export type CropRecommendationFromPromptInput = z.infer<
  typeof CropRecommendationFromPromptInputSchema
>;

const CropRecommendationFromPromptOutputSchema = z.object({
  recommendation: z.string().describe('The crop recommendation.'),
});
export type CropRecommendationFromPromptOutput = z.infer<
  typeof CropRecommendationFromPromptOutputSchema
>;

export async function cropRecommendationFromPrompt(
  input: CropRecommendationFromPromptInput
): Promise<CropRecommendationFromPromptOutput> {
  return cropRecommendationFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropRecommendationFromPrompt',
  input: {schema: CropRecommendationFromPromptInputSchema},
  output: {schema: CropRecommendationFromPromptOutputSchema},
  prompt: `You are an expert in crop recommendations for Indian farmers.

  Based on the following information, provide a personalized crop recommendation:

  User Prompt: {{{prompt}}}

  Consider location, soil type, desired yield, weather patterns, and market demand.
  Provide a concise and practical recommendation.
  `,
});

const cropRecommendationFromPromptFlow = ai.defineFlow(
  {
    name: 'cropRecommendationFromPromptFlow',
    inputSchema: CropRecommendationFromPromptInputSchema,
    outputSchema: CropRecommendationFromPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
