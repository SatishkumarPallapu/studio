'use server';

/**
 * @fileOverview Detects pests and diseases in crops from an image and suggests organic remedies.
 *
 * - diagnosePestDisease - A function that handles the pest and disease diagnosis process.
 * - DiagnosePestDiseaseInput - The input type for the diagnosePestDisease function.
 * - DiagnosePestDiseaseOutput - The return type for the diagnosePestDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnosePestDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DiagnosePestDiseaseInput = z.infer<typeof DiagnosePestDiseaseInputSchema>;

const DiagnosePestDiseaseOutputSchema = z.object({
  diagnosis: z.string().describe('The diagnosis of potential pests or diseases.'),
  remedies: z.string().describe('Suggested organic remedies for the diagnosed issue.'),
});
export type DiagnosePestDiseaseOutput = z.infer<typeof DiagnosePestDiseaseOutputSchema>;

export async function diagnosePestDisease(input: DiagnosePestDiseaseInput): Promise<DiagnosePestDiseaseOutput> {
  return diagnosePestDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePestDiseasePrompt',
  input: {schema: DiagnosePestDiseaseInputSchema},
  output: {schema: DiagnosePestDiseaseOutputSchema},
  prompt: `You are an expert in identifying crop pests and diseases and recommending organic remedies.

  Analyze the image of the crop and provide a diagnosis of potential pests or diseases. Then, suggest organic remedies to address the diagnosed issue.

  Crop Photo: {{media url=photoDataUri}}`,
});

const diagnosePestDiseaseFlow = ai.defineFlow(
  {
    name: 'diagnosePestDiseaseFlow',
    inputSchema: DiagnosePestDiseaseInputSchema,
    outputSchema: DiagnosePestDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
