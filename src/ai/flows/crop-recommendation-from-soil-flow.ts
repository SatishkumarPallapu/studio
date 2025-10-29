
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
  soilType: z.string().describe('The type of soil (e.g., "Red Soil", "Black Cotton Soil").'),
  season: z.string().describe('The current farming season (e.g., "Kharif", "Rabi").'),
  language: z.enum(['English', 'Telugu', 'Hindi']).describe('The language for the response.'),
});
export type CropRecommendationFromSoilInput = z.infer<typeof CropRecommendationFromSoilInputSchema>;

const CropInfoSchema = z.object({
    name: z.string().describe('The common name of the crop.'),
    vitamins: z.string().describe('Key vitamins found in the crop.'),
    medicinal_value: z.string().describe('A brief description of its medicinal properties or health benefits.'),
    harvesting_duration: z.string().describe('The approximate time from planting to harvest (e.g., "30-45 days").'),
    peak_demand_month: z.string().describe('The estimated calendar month of peak market demand if the crop is planted today.'),
    farming_type: z.enum(['Open Field', 'Indoor/Soilless', 'Both']).describe("The recommended farming method for this crop in this context."),
});

const CropRecommendationFromSoilOutputSchema = z.object({
  top_soil_matches: z.array(CropInfoSchema).describe('A list of 4 crops that are the best match for the given soil conditions.'),
  short_duration_crops: z.array(CropInfoSchema).describe('A list of 4 crops with the fastest harvest cycles (30-90 days) for quick ROI.'),
  high_demand_at_harvest_crops: z.array(CropInfoSchema).describe('A list of 4 crops predicted to have high market demand during their calculated harvest month.'),
  high_profit_demand_crops: z.array(CropInfoSchema).describe('A list of 4 crops that have both high profit potential and huge market demand.'),
  indoor_farming_crops: z.array(CropInfoSchema).describe('A list of 4 crops ideal for indoor or soilless farming with easy setup and high demand.'),
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
  prompt: `You are an expert agricultural business advisor for Indian farmers. Your goal is to recommend profitable, efficient, and sustainable crop strategies. All of your output, including crop names, descriptions, and suggestions, MUST be in the requested language: {{{language}}}.

Today's date is {{Date}}.

**Farmer's Data:**
- Nitrogen: {{{nitrogen}}} ppm
- Phosphorus: {{{phosphorus}}} ppm
- Potassium: {{{potassium}}} ppm
- pH: {{{ph}}}
- Location: {{{location}}}
- Soil Type: {{{soilType}}}
- Season: {{{season}}}
- Language: {{{language}}}

**Your Task:**
Generate five distinct categories of crop recommendations (4 crops per category). For each crop, provide the requested information (name, vitamins, medicinal_value, harvesting_duration, peak_demand_month, and farming_type). The farming_type should be 'Indoor/Soilless' only for crops that are exclusively or best grown indoors (like mushrooms, microgreens). It should be 'Both' for crops that can be grown in open fields or indoors (like lettuce, herbs). For all others, it should be 'Open Field'.

**Reference Data for Short-Duration & High-ROI Crops:**
---
### 1. Lettuce (30–60 days)
- **ROI:** High. ₹1.5–3 lakh per acre.
### 2. Spinach / Amaranthus (25–35 days)
- **ROI:** Fastest vegetative return. ₹80,000–1.2 lakh per acre/month.
### 3. Cucumber (45–60 days)
- **ROI:** Excellent early‑market value. ₹1.5–2.5 lakh per acre.
### 4. Bottle Gourd / Lauki (60–75 days)
- **ROI:** Reliable low‑cost, high‑yield. ₹1.5–2 lakh per crop cycle.
### 5. Basil (Tulsi) (45–60 days)
- **ROI:** Quick and stable. ₹1–2 lakh per acre.
### 6. Mushroom Cultivation (Oyster / Button)
- **Duration:** 45-60 days.
- **Farming Type**: Indoor/Soilless
### 7. Cowpea / Cluster Bean (60–70 days)
- **ROI:** 60–70 days. ₹70,000–1 lakh per cycle.
### 8. Watermelon and Muskmelon (60–90 days)
- **ROI:** Strong summer market demand. ₹1.5–2 lakh/acre.
### 9. Coriander and Fenugreek (Methi) Leaves (30–45 days)
- **ROI:** Extremely short duration. ₹60,000–90,000 per cycle.
### 10. Microgreens (10–20 days)
- **ROI:** Fastest return.
- **Farming Type**: Indoor/Soilless

Other common crops: Tomato, Mint, Marigold, Maize, Paddy, Onion, Chilli, Gourds, Flowers, Carrot, Potato, Beetroot, Brinjal, Chickpea, Lentil.
---

**Category 1: Top Soil Matches**
Recommend 4 crops that are the absolute best fit for the provided soil data (N, P, K, pH), location, soil type and season, based on your general agricultural knowledge. Do not be limited by the reference list above for this category.

**Category 2: Fastest ROI Crops**
Recommend 4 crops *from the reference list* with the shortest harvest durations (30-90 days) that are suitable for the farmer's location, soil type, and season.

**Category 3: High-Demand at Harvest**
1.  Select 4 suitable crops for the location, soil type, and season.
2.  Calculate their harvest month if planted today.
3.  Based on general Indian market trends, predict which will have high demand in their harvest month. **Crucially, consider seasonal demand (e.g., watermelon in summer, gourds in winter) and festival demand (e.g., marigolds/flowers for Diwali/Dussehra, sugarcane for Sankranti).**
4.  Recommend these 4 crops, explaining *why* their demand will be high (e.g., "Watermelon demand peaks in May due to summer heat.").

**Category 4: Highest Profit & Huge Demand**
Select 4 crops from the reference list or your general knowledge that represent the best combination of high profitability (ROI) and consistent, huge market demand, suitable for the given context. These are the "star performer" crops.

**Category 5: Indoor Farming Champions**
Recommend 4 crops ideal for indoor or soilless farming. Focus on options with easy setup, high demand in urban markets, and suitability for small spaces (e.g., less than 1 acre). Use the reference data for crops like Microgreens and Mushrooms.

**Final Section: Intercropping Suggestions**
Provide a paragraph with smart intercropping business suggestions in the requested language. Explain which recommended crops can be grown together to maximize land use and soil health.
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
