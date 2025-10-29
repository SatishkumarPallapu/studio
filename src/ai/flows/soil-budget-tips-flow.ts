
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

const InterpretationGuideSchema = z.object({
  title: z.string(),
  intro: z.string(),
  nitrogen: z.object({
    heading: z.string(),
    normal_range: z.string(),
    diy_check: z.string(),
    visual_clues: z.string(),
  }),
  phosphorus: z.object({
    heading: z.string(),
    normal_range: z.string(),
    diy_check: z.string(),
    visual_clues: z.string(),
  }),
  potassium: z.object({
    heading: z.string(),
    normal_range: z.string(),
    diy_check: z.string(),
    visual_clues: z.string(),
  }),
  ph: z.object({
    heading: z.string(),
    normal_range: z.string(),
    diy_check: z.string(),
    visual_clues: z.string(),
  }),
});

const BalancingRecommendationSchema = z.object({
    title: z.string(),
    nitrogen_low: z.string(),
    phosphorus_low: z.string(),
    potassium_low: z.string(),
    ph_imbalance: z.string(),
});

const DosingAdviceSchema = z.object({
    title: z.string(),
    intro: z.string(),
    micro_dosing: z.string(),
    natural_alternatives: z.string(),
});

const BudgetPrinciplesSchema = z.object({
    title: z.string(),
    principles: z.array(z.string()),
});

const BestPracticesSchema = z.object({
    title: z.string(),
    practices: z.array(z.string()),
});


const SoilBudgetTipsOutputSchema = z.object({
  interpretation_guide: InterpretationGuideSchema,
  balancing_recommendations: BalancingRecommendationSchema,
  dosing_advice: DosingAdviceSchema,
  budget_principles: BudgetPrinciplesSchema,
  best_practices: BestPracticesSchema,
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
Based on the soil data and target crop, generate a detailed guide. The tone must be expert but accessible.

**Context:**
- Target Crop: {{{cropName}}}
- Location: {{{location}}}
- Nitrogen: {{{nitrogen}}} ppm
- Phosphorus: {{{phosphorus}}} ppm
- Potassium: {{{potassium}}} ppm
- pH: {{{ph}}}

**Your Task: Generate the following sections:**

**1. Soil Test Report Interpretation Guide:**
   - **title**: "How to Read Your Soil Report (The Farmer's Way)"
   - **intro**: "A simple guide to understanding what your soil is telling you."
   - For **Nitrogen (N)**, **Phosphorus (P)**, **Potassium (K)**, and **pH**:
     - **heading**: e.g., "Nitrogen (N) - The 'Growth' Nutrient"
     - **normal_range**: "For {{{cropName}}}, the ideal range is X-Y ppm. Your level is {{{nitrogen}}} ppm."
     - **diy_check**: "At home, check by... (smell compost, count worms, check soil color/texture for organic matter, use vinegar/baking soda for pH)."
     - **visual_clues**: "Look at your plants: Yellowish, stunted older leaves often mean low Nitrogen. Dark green or purple leaves can mean low Phosphorus. Scorched, yellow leaf edges suggest low Potassium."

**2. Simple, Balancing Recommendations for Each Deficiency:**
   - **title**: "Fixing Imbalances on a Budget"
   - **nitrogen_low**: "If Nitrogen is low: Use green manure (like sunnhemp) before planting—it's almost free. Add well-rotted farmyard manure (FYM). If you must buy, use a small amount of Urea (1-2 kg per acre), but only if absolutely needed."
   - **phosphorus_low**: "If Phosphorus is low: Mix in bone meal or composted poultry manure. If using DAP, apply a very small dose (1-2 kg) split into two applications to avoid waste."
   - **potassium_low**: "If Potassium is low: Wood ash from your kitchen fire is a great free source. Banana peels composted into the soil also work. If needed, a small amount of MOP (1 kg) is enough."
   - **ph_imbalance**: "If pH is off: For acidic soil (low pH), use a sprinkle of lime (sunnam). For salty/alkaline soil (high pH), a little gypsum works. Use small quantities first."

**3. Pesticide & Fertilizer Dosing—Only as Needed, On a Budget:**
   - **title**: "Smart Dosing: Save Money, Save Soil"
   - **intro**: "Don't treat the whole field if only one patch is sick. Save money with spot treatments."
   - **micro_dosing**: "Micro-dosing is key. Apply fertilizer only near the plant roots, not all over the field. This uses less and feeds the plant directly."
   - **natural_alternatives**: "Always try natural options first: Neem cake/oil for pests. Vermicompost or 'jeevamrutam' as a powerful tonic. Buttermilk spray for fungal issues. They are cheaper and build healthier soil for next season."

**4. Key Budget Principles:**
   - **title**: "The Smart Farmer's Budget Rules"
   - **principles**: [
       "Rule #1: Try to keep every treatment under ₹500 per acre.",
       "Rule #2: Green manure is the most cost-effective soil booster if you plan ahead.",
       "Rule #3: Don't buy expensive mixed fertilizers. Buy single nutrients (Urea, MOP) and mix only what you need. It's cheaper.",
       "Rule #4: Your own farm's waste (cow dung, vegetable peels) is free gold. Compost everything."
     ]

**5. Farmer Mindset Best Practices:**
   - **title**: "Think Like a Profitable Farmer"
   - **practices**: [
       "Start with what you have. Don't try to make your soil 'perfect'. Just fix the biggest problem first.",
       "Reinvest profits in soil health. Use money from this harvest to buy green manure seeds or make a better compost pit for the next season.",
       "Confirm this AI plan with an experienced local farmer or extension officer. Their on-the-ground knowledge is invaluable to adapt my recommendations perfectly to your specific field.",
       "Avoid heavy chemicals. They give a quick result but can harm your soil in the long run, costing you more later."
     ]
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

    