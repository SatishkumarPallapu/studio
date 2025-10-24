'use server';

/**
 * @fileOverview Provides market price guidance for farmers using Gemini AI and data from Data.gov.in API.
 *
 * - getMarketPriceGuidance - A function that fetches market price guidance.
 * - MarketPriceGuidanceInput - The input type for the getMarketPriceGuidance function.
 * - MarketPriceGuidanceOutput - The return type for the getMarketPriceGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketPriceGuidanceInputSchema = z.object({
  crop: z.string().describe('The crop for which to fetch market price guidance.'),
  location: z.string().describe('The location (e.g., city, region) for which to fetch market prices.'),
  marketRatesData: z.string().describe('Market rates data as a JSON string from Data.gov.in API.'),
});
export type MarketPriceGuidanceInput = z.infer<typeof MarketPriceGuidanceInputSchema>;

const MarketPriceGuidanceOutputSchema = z.object({
  priceGuidance: z.string().describe('The market price guidance for the specified crop and location.'),
  suggestedPrice: z.string().describe('The suggested price for the farmer to sell their crop at.'),
  marketAnalysis: z.string().describe('Analysis of the current market conditions.'),
});
export type MarketPriceGuidanceOutput = z.infer<typeof MarketPriceGuidanceOutputSchema>;

export async function getMarketPriceGuidance(input: MarketPriceGuidanceInput): Promise<MarketPriceGuidanceOutput> {
  return marketPriceGuidanceFlow(input);
}

const marketPriceGuidancePrompt = ai.definePrompt({
  name: 'marketPriceGuidancePrompt',
  input: {schema: MarketPriceGuidanceInputSchema},
  output: {schema: MarketPriceGuidanceOutputSchema},
  prompt: `You are an AI assistant helping farmers determine the best price for their crops.

  Analyze the following market data and provide price guidance, a suggested price, and a market analysis.

  Crop: {{{crop}}}
  Location: {{{location}}}
  Market Rates Data: {{{marketRatesData}}}

  Provide your response in a structured format.

  Price Guidance:
  Suggested Price:
  Market Analysis:`,
});

const marketPriceGuidanceFlow = ai.defineFlow(
  {
    name: 'marketPriceGuidanceFlow',
    inputSchema: MarketPriceGuidanceInputSchema,
    outputSchema: MarketPriceGuidanceOutputSchema,
  },
  async input => {
    const {output} = await marketPriceGuidancePrompt(input);
    return output!;
  }
);
