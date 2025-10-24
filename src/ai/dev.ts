import { config } from 'dotenv';
config();

import '@/ai/flows/market-price-guidance.ts';
import '@/ai/flows/pest-disease-diagnosis.ts';
import '@/ai/flows/crop-recommendation-from-soil-flow.ts';
import '@/ai/flows/soil-testing-flow.ts';
import '@/ai/flows/crop-roadmap-flow.ts';
import '@/ai/flows/chatbot-flow.ts';
