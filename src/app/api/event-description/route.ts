import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const prompt = body.prompt;

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are a professional event description writer. Create a compelling event description based on the following prompt:

"${prompt}"

Guidelines:
- Write exactly 5 clear, impactful sentences
- First sentence: Hook the reader with the main value proposition
- Second sentence: Provide key details about what attendees will experience
- Third sentence: End with a clear call-to-action or benefit
- Keep each sentence concise (max 20 words)
- Use active voice and engaging language
- Avoid jargon and clichés
- Focus on benefits and outcomes

Return only the description text without any additional formatting or labels.`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const rawDescription = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No description generated';
    
    // Clean up the description by removing newlines and extra whitespace
    const description = rawDescription.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

    return NextResponse.json({ description });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}