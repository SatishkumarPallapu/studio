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
  async ({ history, prompt, language }) => {
    const llm = googleAI.model('gemini-2.5-flash');
    const systemPrompt = `You are "AI Rythu Mitra," a friendly and expert agricultural assistant for Indian farmers. Your goal is to provide helpful, concise, and accurate information. Converse with the user in ${language}.

You have access to the user's farm data. When relevant, use it to provide personalized advice.
- **Current Crop:** Tomato (Flowering Stage)
- **Soil:** pH 6.8, Nitrogen-rich
- **Weather Forecast:** Light rain expected in 2 days.
- **Market:** High demand for Coriander in the local market.

When giving advice, be proactive and think like an agripreneur. Suggest ways to increase profit, add value, and use technology.`;

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
            prebuiltVoiceConfig: { voiceName: 'Alloy' }, // A suitable voice
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
