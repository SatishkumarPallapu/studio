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

Your recommendations must be based on the following high-value, fast-ROI crops and enterprises. Do NOT use any other crops.

---
### High-Value, Fast ROI Crops & Enterprises for Smallholders

1.  **Moringa (Drumstick)**
    -   **ROI Time:** 5–6 months per cycle
    -   **Profit Margin:** ₹3–5 lakh/acre annually
    -   **Why:** Drought-tolerant, low-input, used in exports, nutraceuticals, and powders. Excellent intercrop for vegetables.

2.  **Stevia (Natural Sweetener Leaf)**
    -   **ROI Time:** 4–5 months per harvest (multiple cuts/year)
    -   **Profit Margin:** ₹4–6 lakh/acre/year through pharma and food contracts
    -   **Why:** Heavy demand from health-conscious markets. Low water needs.

3.  **Exotic Vegetables (in Polyhouse/Net House)**
    -   **ROI Time:** 3–4 months
    -   **Profit Margin:** ₹6–10 lakh/acre/year
    -   **Best Crops:** Bell pepper, zucchini, broccoli, lettuce, cherry tomato
    -   **Why:** Premium prices from restaurants and hotels.

4.  **Mushrooms (Oyster, Button, or Shiitake)**
    -   **ROI Time:** 45–60 days
    -   **Profit Margin:** ₹2–8 lakh/year from a 500 sq ft shed
    -   **Why:** Ideal for small spaces, quick turnover, high demand.

5.  **Turmeric and Ginger**
    -   **ROI Time:** 8–10 months
    -   **Profit Margin:** ₹2.5–4 lakh/acre
    -   **Why:** Long shelf life, export potential, thrives in mixed-cropping.

6.  **Medicinal & Herbal Crops (Ashwagandha, Aloe Vera, Lemongrass)**
    -   **ROI Time:** 6–9 months
    -   **Profit Margin:** ₹3–7 lakh/acre/year
    -   **Why:** Used in pharma, cosmetics. High foreign exchange value.

7.  **Microgreens & Hydroponics**
    -   **ROI Time:** 10–20 days (fastest ROI)
    -   **Profit Margin:** ₹20–25 lakh/year in small indoor setups
    -   **Why:** Fast yield, minimal space, high-end restaurant demand.

8.  **Dragon Fruit Farming**
    -   **ROI Time:** 8–12 months
    -   **Profit Margin:** ₹6–8 lakh/acre/year after maturity
    -   **Why:** High export demand, survives arid zones, minimal pesticides.

---
You may also recommend from this list of common Indian crops if they fit the profitability goal:
- Tomato
- Mint (Pudina)
- Coriander (Kothimir)
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
