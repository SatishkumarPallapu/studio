'use server';
/**
 * @fileOverview An AI agent to extract soil testing data from uploaded documents.
 *
 * - extractSoilData - A function that handles the soil data extraction process.
 * - ExtractSoilDataInput - The input type for the extractSoilData function.
 * - ExtractSoilDataOutput - The return type for the extractSoilData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractSoilDataInputSchema = z.object({
  reportDataUri: z
    .string()
    .describe(
      "A soil report as a data URI. Can be an image or a PDF. It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  mimeType: z.string().describe('The MIME type of the uploaded file (e.g., "image/jpeg", "application/pdf").'),
});
export type ExtractSoilDataInput = z.infer<typeof ExtractSoilDataInputSchema>;

const ExtractSoilDataOutputSchema = z.object({
  nitrogen: z.number().describe('Nitrogen (N) value in ppm (parts per million).'),
  phosphorus: z.number().describe('Phosphorus (P) value in ppm.'),
  potassium: z.number().describe('Potassium (K) value in ppm.'),
  ph: z.number().describe('The pH level of the soil.'),
  fertility: z.string().describe('A brief, one-sentence assessment of the soil fertility (e.g., "Good", "Needs improvement", "Excellent for acidic crops").'),
});
export type ExtractSoilDataOutput = z.infer<typeof ExtractSoilDataOutputSchema>;

export async function extractSoilData(input: ExtractSoilDataInput): Promise<ExtractSoilDataOutput> {
  return soilTestingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'soilTestingPrompt',
  input: {schema: ExtractSoilDataInputSchema},
  output: {schema: ExtractSoilDataOutputSchema},
  prompt: `You are an expert agricultural analyst. Analyze the provided soil test report, which is either an image or a PDF.

Extract the following values:
- Nitrogen (N)
- Phosphorus (P)
- Potassium (K)
- pH level

The values for N, P, and K might be in kg/hectare, lb/acre, or ppm. Convert them to ppm if necessary. Assume standard conversions if not specified.
Based on the extracted values, provide a one-sentence assessment of the soil's fertility.

Document:
{{media url=reportDataUri}}`,
});

const soilTestingFlow = ai.defineFlow(
  {
    name: 'soilTestingFlow',
    inputSchema: ExtractSoilDataInputSchema,
    outputSchema: ExtractSoilDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
