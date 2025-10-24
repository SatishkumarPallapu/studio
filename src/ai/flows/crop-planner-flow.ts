'use server';
/**
 * @fileOverview Generates intercropping and companion planting plans.
 *
 * - generateCropPlan - Creates a visual and descriptive crop plan.
 * - CropPlanInput - Input for the crop plan flow.
 * - CropPlanOutput - Output for the crop plan flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropPlanInputSchema = z.object({
  primaryCrops: z.array(z.string()).describe('A list of primary crops the farmer wants to plant.'),
  location: z.string().describe('The geographical location of the farm (e.g., "Anantapur, Andhra Pradesh").'),
});
export type CropPlanInput = z.infer<typeof CropPlanInputSchema>;

const CompanionCropSchema = z.object({
    name: z.string().describe('The name of the companion crop.'),
    benefits: z.string().describe('A brief explanation of why it is a good companion.'),
});

const IntercroppingPlanSchema = z.object({
    primaryCrop: z.string().describe('The primary crop for this specific plan.'),
    companionCrops: z.array(CompanionCropSchema).describe('A list of suggested companion crops.'),
    layout_suggestion: z.string().describe('A simple text-based suggestion for arranging the crops (e.g., "Plant in alternating rows").'),
});

const CropPlanOutputSchema = z.object({
  plans: z.array(IntercroppingPlanSchema).describe('An array of intercropping plans, one for each primary crop.'),
  synergy_benefits: z.string().describe('A summary paragraph explaining the overall benefits of the suggested combinations, such as pest control, nutrient sharing, and improved yield.'),
});
export type CropPlanOutput = z.infer<typeof CropPlanOutputSchema>;


export async function generateCropPlan(input: CropPlanInput): Promise<CropPlanOutput> {
  return cropPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropPlannerPrompt',
  input: {schema: CropPlanInputSchema},
  output: {schema: CropPlanOutputSchema},
  prompt: `You are an expert agricultural planner specializing in sustainable Indian farming practices.

For the given primary crops and location, create a set of intercropping (companion planting) plans.

Primary Crops: {{{json primaryCrops}}}
Location: {{{location}}}

For each primary crop, suggest 2-3 companion crops that grow well with it in the specified region. For each companion, explain the specific benefits (e.g., "Marigolds repel nematodes," "Beans fix nitrogen for corn").

Also provide a simple spatial layout suggestion for each group.

Finally, write a summary paragraph explaining the overall synergistic benefits of implementing these intercropping strategies.
`,
});

const cropPlannerFlow = ai.defineFlow(
  {
    name: 'cropPlannerFlow',
    inputSchema: CropPlanInputSchema,
    outputSchema: CropPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
