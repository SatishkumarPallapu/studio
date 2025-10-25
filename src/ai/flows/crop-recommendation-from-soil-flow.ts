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
  prompt: `You are an expert agricultural business advisor helping Indian farmers become "agripreneurs". Your goal is to recommend a profitable, efficient, and sustainable crop strategy.

Based on the provided soil data and location, recommend 3 to 5 suitable crops. Prioritize crops with shorter growth cycles (quick cash crops) and those that work well in intercropping systems.

You MUST ONLY choose from the following list of crops:
- Tomato
- Mint (Pudina)
- Coriander (Kothimir / Kothimeera)
- Marigold (Kalya Maku)
- Maize / Corn (Mokka Jonna)
- Paddy (Rice crop)
- Onion
- Chilli / Mirchi
- Ridge gourd (Beerakaya)
- Bottle gourd (Sorakaya)
- Marigold flowers (Banti Puvvulu)
- Chrysanthemum flowers (Chamanti Puvvulu)
- Carrot
- Potato (Bangala Dumpa)
- Beetroot
- Sweet potato
- Radish
- Brinjal / Eggplant (Vankaya)
- Cucumber
- Spinach (Palakura)
- Amaranthus (Thotakura)
- Lady’s finger / Okra (Bendakaya)
- Chickpea (Senaga)
- Lentil (Masur)
- Field Pea (Batani)
- Horse Gram (Ulavalu)
- Kidney Bean (Rajma)

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

Additionally, provide a paragraph with smart intercropping business suggestions. Explain which of the recommended crops can be grown together to maximize land use, diversify income, and improve soil fertility (e.g., "Grow Coriander between rows of Tomatoes. The Coriander will be ready for harvest in 40 days, providing early income while the Tomatoes mature.").
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
