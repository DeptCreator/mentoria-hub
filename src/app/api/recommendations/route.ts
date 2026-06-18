import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { profile, courses, opportunities } = await request.json();

    const prompt = `You are an AI education advisor for Mentoria Hub. Based on the student profile, recommend the most relevant courses and opportunities.

Student Profile:
- Grade: ${profile.grade || 'Not specified'}
- Interests: ${profile.interests?.join(', ') || 'Not specified'}
- Goals: ${profile.goals?.join(', ') || 'Not specified'}
- Country: ${profile.country || 'Not specified'}

Available Courses:
${courses.map((c: any) => `- ${c.title} (${c.category}, ${c.level}): ${c.description}`).join('\\n')}

Available Opportunities:
${opportunities.map((o: any) => `- ${o.title} (${o.category}, ${o.format}): ${o.description}`).join('\\n')}

Provide 3-5 personalized recommendations in JSON format:
{
  "recommendations": [
    {
      "type": "course" | "opportunity",
      "id": "item_id",
      "reason": "Why this is recommended for the student",
      "confidence": 0.85
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful education advisor. Respond only with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    const result = JSON.parse(content || '{"recommendations": []}');

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI recommendation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations', recommendations: [] },
      { status: 500 }
    );
  }
}
