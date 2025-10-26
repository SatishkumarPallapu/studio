
'use server';
/**
 * @fileOverview Generates a day-wise farming roadmap for a given crop.
 *
 * - generateCropRoadmap - Creates the roadmap.
 * - CropRoadmapInput - Input for the roadmap flow.
 * - CropRoadmapOutput - Output for the roadmap flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropRoadmapInputSchema = z.object({
  cropName: z.string().describe('The name of the crop for which to generate a roadmap.'),
  farmingType: z.enum(['Open Field', 'Indoor/Soilless', 'Both']).optional().describe("The context of farming. If 'Indoor/Soilless', instructions must be for an indoor setup."),
});
export type CropRoadmapInput = z.infer<typeof CropRoadmapInputSchema>;

const ActivitySchema = z.object({
  day: z.number().describe('The day number in the crop cycle (e.g., 1, 15, 90).'),
  stage: z.enum(["land_preparation", "sowing_planting", "vegetative_growth", "flowering_fruiting", "harvesting", "post_harvest"]).describe("The growth stage for the activity."),
  activity: z.string().describe('The title of the farming activity (e.g., "First Irrigation").'),
  details: z.string().describe('A detailed description of the activity and its importance.'),
});

const CropRoadmapOutputSchema = z.object({
  cropName: z.string(),
  activities: z.array(ActivitySchema).describe('A list of day-wise activities.'),
});
export type CropRoadmapOutput = z.infer<typeof CropRoadmapOutputSchema>;

export async function generateCropRoadmap(input: CropRoadmapInput): Promise<CropRoadmapOutput> {
  return cropRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropRoadmapPrompt',
  input: {schema: CropRoadmapInputSchema},
  output: {schema: CropRoadmapOutputSchema},
  prompt: `You are an expert agriculturalist who creates detailed farming plans for Indian crops.

Generate a comprehensive, day-wise farming roadmap for '{{{cropName}}}'.

**CRITICAL CONTEXT:** The farming type is '{{{farmingType}}}'.
- If 'farmingType' is 'Indoor/Soilless', all instructions MUST be for an indoor setup. This means:
    - Replace "land preparation" with "container/system setup".
    - Instructions should be about hydroponics, grow mediums (coco peat), nutrient solutions, and grow lights, NOT about open fields, soil, or plowing.
    - Example for sowing: "Place seeds in rockwool cubes soaked in pH-balanced water."
- If 'farmingType' is 'Open Field' or not specified, provide standard instructions for traditional farming.

Group activities into the following stages:
- land_preparation (or system_setup for indoor)
- sowing_planting
- vegetative_growth
- flowering_fruiting
- harvesting
- post_harvest

For each activity, provide:
- The day number (approximate, starting from Day 1).
- The stage of growth.
- A clear activity title.
- Detailed instructions and reasoning for the activity.

Provide at least 2-3 activities for each stage.
`,
});

const cropRoadmapFlow = ai.defineFlow(
  {
    name: 'cropRoadmapFlow',
    inputSchema: CropRoadmapInputSchema,
    outputSchema: CropRoadmapOutputSchema,
  },
  async input => {
    // If farmingType is not provided, default to 'Open Field'
    const finalInput = {
      ...input,
      farmingType: input.farmingType || 'Open Field',
    };
    const {output} = await prompt(finalInput);
    return output!;
  }
);
