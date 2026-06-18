import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-key') {
      return NextResponse.json({ error: 'OpenAI API key is not configured' }, { status: 500 });
    }

    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text.slice(0, 4000),
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    const base64 = buffer.toString('base64');

    return NextResponse.json({ audio: base64 });
  } catch (error: any) {
    console.error('Text-to-speech error:', error);
    const message = error?.message || 'Failed to generate speech';
    const status = error?.status || 500;
    return NextResponse.json({ error: message }, { status });
  }
}
