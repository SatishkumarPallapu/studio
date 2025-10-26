
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
    harvesting_duration: z.string().describe('The approximate time from planting to harvest (e.g., "30-45 days").'),
    peak_demand_month: z.string().describe('The estimated calendar month of peak market demand if the crop is planted today.'),
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
  prompt: `You are an expert agricultural business advisor helping Indian farmers become "agripreneurs". Your goal is to recommend a profitable, efficient, and sustainable crop strategy, focusing on short-duration crops for the fastest ROI.

Your recommendations must be based on the following high-value, fast-ROI crops and enterprises. Do NOT use any other crops. Prioritize crops from the "Fastest Cash Crops (Under 6 Months)" list first.

---
### Fastest Cash Crops for ROI on <1 acre (Under 6 Months)

1.  **Radish (21-30 days)** - Ideal for quick turnover and continuous income.
2.  **Spinach & Leafy Mixes (30-45 days)** - Strong local demand, allows for multiple cuts.
3.  **Asian Greens (Pak Choy, etc.) (35-45 days)** - High-value for premium salad markets.
4.  **Cucumber / Zucchini (45-60 days)** - Quick cash turnover, especially in summer.
5.  **Cherry Tomatoes (in Greenhouse) (70-85 days)** - Premium pricing and long harvest window.
6.  **Green Onion / Spring Onion (60-75 days)** - Grown year-round with consistent demand.
7.  **Mushrooms (Oyster or Button) (30-45 days)** - Top choice for limited space, produces continuously.
8.  **Baby Carrots & Hakurei Turnips (40-60 days)** - Premium price in early season.
9.  **Coriander & Dill Leaves (30-45 days)** - Continuous urban demand, good as a filler crop.
10. **Okra (Bhindi) (60-75 days)** - Resilient to summer stress with multiple pickings.

---
### Other High-Value, Fast ROI Crops & Enterprises for Smallholders

1.  **Moringa (Drumstick) (5–6 months)**
2.  **Stevia (Natural Sweetener Leaf) (4–5 months)**
3.  **Exotic Vegetables (in Polyhouse/Net House) (e.g., Bell pepper, zucchini, broccoli, cherry tomato)**
4.  **Turmeric and Ginger (8–10 months)**
5.  **Medicinal & Herbal Crops (Ashwagandha, Aloe Vera, Lemongrass) (6–9 months)**
6.  **Dragon Fruit Farming (8–12 months)**

---
You may also recommend from this list of common Indian crops if they fit the profitability and short-duration goal:
- Tomato (60-90 days)
- Mint (Pudina) (60-90 days)
- Marigold (Kalya Maku) (60-70 days)
- Maize / Corn (Mokka Jonna) (90-100 days)
- Paddy (Rice crop) (120-150 days)
- Onion (90-120 days)
- Chilli / Mirchi (70-100 days)
- Ridge gourd (Beerakaya) (50-60 days)
- Bottle gourd (Sorakaya) (60-70 days)
- Marigold flowers (Banti Puvvulu) (60-70 days)
- Chrysanthemum flowers (Chamanti Puvvulu) (90-120 days)
- Carrot (70-80 days)
- Potato (Bangala Dumpa) (90-120 days)
- Beetroot (60-70 days)
- Sweet potato (90-120 days)
- Brinjal / Eggplant (Vankaya) (70-90 days)
- Spinach (Palakura) (30-45 days)
- Amaranthus (Thotakura) (30-40 days)
- Lady’s finger / Okra (Bendakaya) (60-75 days)
- Chickpea (Senaga) (90-100 days)
- Lentil (Masur) (110-130 days)
- Field Pea (Batani) (80-100 days)
- Horse Gram (Ulavalu) (120-180 days)
- Kidney Bean (Rajma) (90-120 days)

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
4. **Harvesting Duration:** The time from planting to harvest, based on the provided lists (e.g., "30-45 days").
5. **Peak Demand Month:** Based on the harvesting duration, calculate and state the calendar month of peak demand (e.g., if planted today, "September"). Assume today's date is {{Date}}.

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

    