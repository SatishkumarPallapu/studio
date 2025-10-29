
'use server';
/**
 * @fileOverview Generates soil diagnosis and budget-friendly tips for a specific crop.
 *
 * - generateSoilBudgetTips - Creates the tips.
 * - SoilBudgetTipsInput - Input for the flow.
 * - SoilBudgetTipsOutput - Output for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SoilBudgetTipsInputSchema = z.object({
  nitrogen: z.number().describe('Nitrogen content in ppm.'),
  phosphorus: z.number().describe('Phosphorus content in ppm.'),
  potassium: z.number().describe('Potassium content in ppm.'),
  ph: z.number().describe('Soil pH level.'),
  cropName: z.string().describe('The target crop for the recommendations.'),
  location: z.string().describe('The geographical location of the farm.'),
});
export type SoilBudgetTipsInput = z.infer<typeof SoilBudgetTipsInputSchema>;

const SoilBudgetTipsOutputSchema = z.object({
  report: z.string().describe("A comprehensive, well-formatted report string containing all soil advice sections."),
});
export type SoilBudgetTipsOutput = z.infer<typeof SoilBudgetTipsOutputSchema>;

export async function generateSoilBudgetTips(input: SoilBudgetTipsInput): Promise<SoilBudgetTipsOutput> {
  return soilBudgetTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'soilBudgetTipsPrompt',
  input: {schema: SoilBudgetTipsInputSchema},
  output: {schema: SoilBudgetTipsOutputSchema},
  prompt: `You are an expert, seasoned Indian agronomist who thinks and speaks like a practical, cash-constrained farmer. Your goal is to maximize net profit by making every rupee count.
Based on the soil data and target crop, generate a detailed guide as a single, formatted string. Use markdown for headings.

**Context:**
- Target Crop: {{{cropName}}}
- Location: {{{location}}}
- Nitrogen: {{{nitrogen}}} ppm
- Phosphorus: {{{phosphorus}}} ppm
- Potassium: {{{potassium}}} ppm
- pH: {{{ph}}}

**Your Task: Generate a report string with the following sections:**

### How to Read Your Soil Report (The Farmer's Way)
A simple guide to understanding what your soil is telling you.
- **Nitrogen (N) - The 'Growth' Nutrient**: For {{{cropName}}}, the ideal range is X-Y ppm. Your level is {{{nitrogen}}} ppm.
- **Phosphorus (P) - The 'Root' Nutrient**: For {{{cropName}}}, the ideal range is X-Y ppm. Your level is {{{phosphorus}}} ppm.
- **Potassium (K) - The 'Fruit' Nutrient**: For {{{cropName}}}, the ideal range is X-Y ppm. Your level is {{{potassium}}} ppm.
- **pH - The 'Balance'**: For {{{cropName}}}, the ideal range is X-Y. Your level is {{{ph}}}.

### Fixing Imbalances on a Budget
- **If Nitrogen is low**: Use green manure (like sunnhemp) before planting—it's almost free. Add well-rotted farmyard manure (FYM). If you must buy, use a small amount of Urea (1-2 kg per acre).
- **If Phosphorus is low**: Mix in bone meal or composted poultry manure. If using DAP, apply a very small dose (1-2 kg) split into two applications to avoid waste.
- **If Potassium is low**: Wood ash from your kitchen fire is a great free source. Banana peels composted into the soil also work. If needed, a small amount of MOP (1 kg) is enough.
- **If pH is off**: For acidic soil (low pH), use a sprinkle of lime (sunnam). For salty/alkaline soil (high pH), a little gypsum works.

### Smart Dosing: Save Money, Save Soil
Don't treat the whole field if only one patch is sick. Save money with spot treatments. Micro-dosing is key. Apply fertilizer only near the plant roots. Always try natural options first: Neem cake/oil for pests. Vermicompost or 'jeevamrutam' as a powerful tonic.

### The Smart Farmer's Budget Rules
1. Try to keep every treatment under ₹500 per acre.
2. Green manure is the most cost-effective soil booster.
3. Don't buy expensive mixed fertilizers. Buy single nutrients and mix only what you need.
4. Your own farm's waste (cow dung, vegetable peels) is free gold. Compost everything.

### Think Like a Profitable Farmer
- Start with what you have. Don't try to make your soil 'perfect'.
- Reinvest profits in soil health for the next season.
- Confirm this AI plan with an experienced local farmer or extension officer. Their knowledge is invaluable.
`,
});

const soilBudgetTipsFlow = ai.defineFlow(
  {
    name: 'soilBudgetTipsFlow',
    inputSchema: SoilBudgetTipsInputSchema,
    outputSchema: SoilBudgetTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
    
