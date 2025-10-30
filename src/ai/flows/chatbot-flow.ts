
'use server';
/**
 * @fileOverview A multilingual chatbot for farmers with voice capabilities.
 *
 * - chat - Handles text-based chat in multiple languages.
 * - textToSpeech - Converts text to speech.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/google-genai';
import { Message, Part } from 'genkit';

// Chat Flow
const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({ text: z.string() })),
  })),
  prompt: z.string(),
  language: z.enum(['English', 'Telugu', 'Hindi']),
  activeCrop: z.string().describe('The name of the current crop being tracked by the farmer.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string(),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async ({ history, prompt, language, activeCrop }) => {
    const llm = googleAI.model('gemini-1.5-flash-latest');
    const systemPrompt = `You are "AI Rythu Mitra," a specialized AI agronomist and business advisor for Indian farmers. Your primary mission is to help the farmer maximize the yield and profitability of their *current active crop* by providing timely, data-driven advice.

Your expertise is laser-focused on the crop's entire lifecycle. Your advice must be practical, specific to the crop's current stage, and use all available farm data. You must converse in ${language}.

## Current Farm Context
- **Active Crop:** ${activeCrop}
- **Current Stage:** Flowering (Day 45)
- **Soil Data:** pH 6.8, Nitrogen-rich, Phosphorus-optimal, Potassium-low.
- **Live IoT Data:** Soil moisture at 45% (Slightly dry for flowering stage).
- **Weather Forecast:** Light rain expected in 2 days. No rain today or tomorrow.
- **Market Intel:** High demand for premium, blemish-free ${activeCrop}.

## Your Directives
1.  **Be Proactive & Action-Oriented:** Don't just answer questions. Anticipate needs based on the crop's stage and data. Suggest concrete actions.
2.  **Focus on the Active Crop:** All advice must relate to the current ${activeCrop} crop. Do not suggest planting other crops or unrelated activities.
3.  **Use the Data:** Your recommendations must be backed by the farm context. (e.g., "Because your potassium is low and the plant is flowering, I recommend...").
4.  **Agripreneur Mindset:** Frame your advice in terms of profitability and quality. Explain *why* an action will lead to better yield or higher market value.
5.  **Pest/Disease Prevention:** Based on the flowering stage, warn about common risks like Blossom End Rot (due to calcium uptake issues, related to watering) or fungal infections. Suggest preventative organic sprays.

Example of a good response: "Based on your soil data, your potassium is a bit low for the flowering stage. I recommend applying a foliar spray of sulfate of potash (0-0-50) at 2-3 grams per liter of water. This will improve fruit setting and quality, which is important given the high market demand for premium ${activeCrop}. Also, since your soil moisture is at 45%, a brief 20-minute drip irrigation cycle is advisable today to avoid blossom end rot."
`;

    const systemMessage: Message = {
      role: 'system',
      content: [{text: systemPrompt}]
    };

    const response = await ai.generate({
      model: llm,
      prompt: prompt,
      history: [systemMessage, ...history],
    });

    return { response: response.text };
  }
);

// Text-to-Speech Flow
const TextToSpeechInputSchema = z.object({
  text: z.string(),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audio: z.string().describe('Base64 encoded WAV audio data as a data URI.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async ({ text }) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Achernar' }, // A suitable voice
          },
        },
      },
      prompt: text,
    });
    if (!media) {
      throw new Error('No audio media was generated.');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavData = await toWav(audioBuffer);
    return {
      audio: 'data:audio/wav;base64,' + wavData,
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
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
