import { NextResponse, NextRequest } from 'next/server';
import { sendWhatsAppMessage } from '@/services/whatsapp-service';

export async function POST(req: NextRequest) {
  try {
    const { to, message } = await req.json();

    if (!to || !message) {
      return NextResponse.json({ error: "Missing 'to' or 'message'" }, { status: 400 });
    }

    await sendWhatsAppMessage(to, message);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error sending WhatsApp message:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
