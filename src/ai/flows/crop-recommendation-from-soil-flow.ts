'use server';
/**
 * @fileOverview An AI agent for crop recommendation based on soil data.
 *
 * - cropRecommendationFromSoil - Recommends crops based on soil metrics.
 * - CropRecommendationFromSoilInput - Input for the recommendation flow.
 * - CropRecommendationFromSoilOutput - Output for the recommendation flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropRecommendationFromSoilInputSchema = z.object({
  nitrogen: z.number().describe('Nitrogen content in ppm.'),
  phosphorus: z.number().describe('Phosphorus content in ppm.'),
  potassium: z.number().describe('Potassium content in ppm.'),
  ph: z.number().describe('Soil pH level.'),
  location: z.string().describe('The geographical location of the farm (e.g., "Anantapur, Andhra Pradesh").'),
});
export type CropRecommendationFromSoilInput = z.infer<typeof CropRecommendationFromSoilInputSchema>;

const CropInfoSchema = z.object({
    name: z.string().describe('The common name of the crop.'),
    vitamins: z.string().describe('Key vitamins found in the crop.'),
    medicinal_value: z.string().describe('A brief description of its medicinal properties or health benefits.'),
});

const CropRecommendationFromSoilOutputSchema = z.object({
  recommended_crops: z.array(CropInfoSchema).describe('A list of 3-5 suitable Indian crops.'),
  intercropping_suggestions: z.string().describe('A paragraph suggesting compatible crops that can be grown together to improve soil health and yield.'),
});
export type CropRecommendationFromSoilOutput = z.infer<typeof CropRecommendationFromSoilOutputSchema>;


export async function cropRecommendationFromSoil(
  input: CropRecommendationFromSoilInput
): Promise<CropRecommendationFromSoilOutput> {
  return cropRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropRecommendationFromSoilPrompt',
  input: {schema: CropRecommendationFromSoilInputSchema},
  output: {schema: CropRecommendationFromSoilOutputSchema},
  prompt: `You are an expert agricultural advisor for Indian farmers. Based on the provided soil data and location, recommend 3 to 5 suitable crops from a diverse list of over 1000 Indian crop varieties (including cereals, pulses, vegetables, fruits, and cash crops).

Soil Data:
- Nitrogen: {{{nitrogen}}} ppm
- Phosphorus: {{{phosphorus}}} ppm
- Potassium: {{{potassium}}} ppm
- pH: {{{ph}}}
- Location: {{{location}}}

For each recommended crop, provide:
1. Common Name
2. Key Vitamins
3. A brief description of its medicinal value or health benefits.

Additionally, provide a paragraph with intercropping suggestions, explaining which of the recommended crops (or other compatible plants) can be grown together to benefit each other and improve soil fertility. Consider factors like nutrient cycling, pest control, and physical support.
`,
});

const cropRecommendationFlow = ai.defineFlow(
  {
    name: 'cropRecommendationFlow',
    inputSchema: CropRecommendationFromSoilInputSchema,
    outputSchema: CropRecommendationFromSoilOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
