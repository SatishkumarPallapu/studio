'use server';
/**
 * @fileOverview Generates a weekly farm report with a text and voice summary.
 * 
 * - generateWeeklyReport: Creates the report.
 * - WeeklyReportInput: Input for the report flow.
 * - WeeklyReportOutput: Output for the report flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/google-genai';


const WeeklyReportInputSchema = z.object({
    farmActivities: z.string().describe('A summary of farm activities for the past week, e.g., crops watered, fertilizer applied, pest control measures.'),
    weatherData: z.string().describe('A summary of the weather conditions for the past week, e.g., average temperature, rainfall.'),
});
export type WeeklyReportInput = z.infer<typeof WeeklyReportInputSchema>;

const WeeklyReportOutputSchema = z.object({
  textSummary: z.string().describe('A concise AI-generated summary of the weekly report.'),
  voiceSummaryAudio: z.string().describe('Base64 encoded WAV audio data of the summary as a data URI.'),
});
export type WeeklyReportOutput = z.infer<typeof WeeklyReportOutputSchema>;

export async function generateWeeklyReport(input: WeeklyReportInput): Promise<WeeklyReportOutput> {
    return weeklyReportFlow(input);
}


const weeklyReportFlow = ai.defineFlow(
    {
        name: 'weeklyReportFlow',
        inputSchema: WeeklyReportInputSchema,
        outputSchema: WeeklyReportOutputSchema,
    },
    async (input) => {
        const llm = googleAI.model('gemini-1.5-flash-latest');

        // 1. Generate Text Summary
        const summaryPrompt = `You are an agricultural analyst. Based on the following weekly data, generate a concise summary and provide 3 actionable recommendations for the upcoming week.
        
        Farm Activities: ${input.farmActivities}
        Weather Data: ${input.weatherData}
        
        Provide a summary paragraph followed by a bulleted list of 3 recommendations.`;

        const summaryResponse = await ai.generate({
            model: llm,
            prompt: summaryPrompt,
        });

        const textSummary = summaryResponse.text;

        // 2. Generate Voice Summary
        const { media } = await ai.generate({
            model: googleAI.model('gemini-2.5-flash-preview-tts'),
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Achernar' },
                    },
                },
            },
            prompt: textSummary,
        });

        if (!media) {
            throw new Error('No audio media was generated for the weekly report.');
        }

        const audioBuffer = Buffer.from(
            media.url.substring(media.url.indexOf(',') + 1),
            'base64'
        );
        const wavData = await toWav(audioBuffer);
        const voiceSummaryAudio = 'data:audio/wav;base64,' + wavData;

        return {
            textSummary,
            voiceSummaryAudio,
        };
    }
);


async function toWav(
    pcmData: Buffer,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
): Promise<string> {
    return new Promise((resolve, reject) => {
        const writer = new wav.Writer({
            channels,
            sampleRate: rate,
            bitDepth: sampleWidth * 8,
        });

        const bufs: any[] = [];
        writer.on('error', reject);
        writer.on('data', (d) => {
            bufs.push(d);
        });
        writer.on('end', () => {
            resolve(Buffer.concat(bufs).toString('base64'));
        });

        writer.write(pcmData);
        writer.end();
    });
}
