import { config } from 'dotenv';
config();

import '@/ai/flows/market-price-guidance.ts';
import '@/ai/flows/pest-disease-diagnosis.ts';
import '@/ai/flows/crop-recommendation-from-prompt.ts';