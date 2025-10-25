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

1.  **Moringa (Drumstick)**
    -   **ROI Time:** 5–6 months per cycle
    -   **Why:** Drought-tolerant, low-input, used in exports, nutraceuticals, and powders. Excellent intercrop for vegetables.

2.  **Stevia (Natural Sweetener Leaf)**
    -   **ROI Time:** 4–5 months per harvest (multiple cuts/year)
    -   **Why:** Heavy demand from health-conscious markets. Low water needs.

3.  **Exotic Vegetables (in Polyhouse/Net House)**
    -   **Best Crops:** Bell pepper, zucchini, broccoli, cherry tomato
    -   **Why:** Premium prices from restaurants and hotels.

4.  **Turmeric and Ginger**
    -   **ROI Time:** 8–10 months
    -   **Why:** Long shelf life, export potential, thrives in mixed-cropping.

5.  **Medicinal & Herbal Crops (Ashwagandha, Aloe Vera, Lemongrass)**
    -   **ROI Time:** 6–9 months
    -   **Why:** Used in pharma, cosmetics. High foreign exchange value.

6.  **Dragon Fruit Farming**
    -   **ROI Time:** 8–12 months
    -   **Why:** High export demand, survives arid zones, minimal pesticides.

---
You may also recommend from this list of common Indian crops if they fit the profitability and short-duration goal:
- Tomato
- Mint (Pudina)
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
- Brinjal / Eggplant (Vankaya)
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
