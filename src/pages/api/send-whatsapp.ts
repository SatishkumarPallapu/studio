import type { NextApiRequest, NextApiResponse } from 'next';
import { sendWhatsAppMessage } from '@/services/whatsapp-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: "Missing 'to' or 'message'" });
    }

    await sendWhatsAppMessage(to, message);

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Error sending WhatsApp message:', err);
    return res
      .status(500)
      .json({ error: err.message || 'Internal Server Error' });
  }
}
