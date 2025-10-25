/**
 * src/services/whatsapp-service.ts
 * ---------------------------------------------------------
 * Centralized WhatsApp messaging utility using Twilio API.
 * ---------------------------------------------------------
 * ✅ Supports sending proactive or AI-triggered messages.
 * ✅ Works with Firebase Functions or Next.js API routes.
 * ✅ Keeps credentials secure via environment variables.
 */

import twilio from 'twilio';

/* ---------------------------------------------------------
 * 🔐 Environment Variables
 * ---------------------------------------------------------
 * Set these in your Firebase or local `.env` file:
 *
 * TWILIO_ACCOUNT_SID=<your Twilio Account SID>
 * TWILIO_AUTH_TOKEN=<your Twilio Auth Token>
 * TWILIO_WHATSAPP_FROM=whatsapp:+14155238886   // Twilio sandbox sender
 */

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM } =
  process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
  console.warn(
    '[WhatsApp Service] Missing Twilio environment variables. Messages will not send until configured.'
  );
}

// Twilio REST client (safe to reuse)
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/* ---------------------------------------------------------
 * 📤 Send WhatsApp Message
 * ---------------------------------------------------------
 * @param to - Receiver’s WhatsApp number (e.g. whatsapp:+919876543210)
 * @param message - Text body to send
 * @returns Promise<void>
 */

export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<void> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
    // In a real app, you might want to throw an error or handle this more gracefully.
    // For now, we'll log a warning and return to avoid breaking the app if keys are missing.
    console.warn(
      'Cannot send WhatsApp message because Twilio environment variables are not configured.'
    );
    // Returning a resolved promise to not block the calling flow in a non-configured environment.
    return Promise.resolve();
  }

  try {
    const response = await client.messages.create({
      from: TWILIO_WHATSAPP_FROM,
      to,
      body: message,
    });

    console.log('✅ WhatsApp message sent:', {
      to,
      sid: response.sid,
      status: response.status,
    });
  } catch (error: any) {
    console.error('❌ Failed to send WhatsApp message:', error.message || error);
    // Re-throwing the error allows the calling function (e.g., an API route) to handle the failure.
    throw error;
  }
}

/* ---------------------------------------------------------
 * 🧩 Example Usage
 * ---------------------------------------------------------
 * // In any service or Firebase Function:
 * import { sendWhatsAppMessage } from "@/services/whatsapp-service";
 *
 * await sendWhatsAppMessage(
 *   "whatsapp:+919876543210",
 *   "🌾 Hi farmer! Here’s your daily crop tip: Water your paddy field early morning."
 * );
 *
 * ---------------------------------------------------------
 * 🪄 TODO:
 * - [ ] Add Firestore logging of sent messages (optional)
 * - [ ] Handle webhook events for delivery/read receipts
 * - [ ] Securely call this from Firebase Functions for automation
 * ---------------------------------------------------------
 */
