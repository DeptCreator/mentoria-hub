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

    const { messages, profile } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const systemPrompt = `You are Jarvis, an AI education assistant for Mentoria Hub. You help students find educational opportunities, courses, and provide guidance.

Student Profile:
${profile ? `- Grade: ${profile.grade || 'Unknown'}
- Interests: ${profile.interests?.join(', ') || 'Unknown'}
- Goals: ${profile.goals?.join(', ') || 'Unknown'}` : 'No profile available'}

Be helpful, encouraging, and concise. Provide specific recommendations when possible.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({
      message: completion.choices[0].message.content,
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
