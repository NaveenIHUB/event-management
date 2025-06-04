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
                  text: `You are a professional event title generator. Create 5 engaging and memorable event titles based on the following theme:

"${prompt}"

Guidelines:
- Each title should be 2-4 words long
- Make titles catchy and memorable
- Use action words and power verbs where appropriate
- Avoid generic terms like "Event" or "Conference"
- Ensure titles are clear and self-explanatory
- Include a mix of creative and professional tones

Return the titles in a numbered list format (1. Title).`,
                },
              ],
          },
        ],
      }),
    });

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Extract numbered lines using regex
    const titles = rawText.match(/^\d+[\.\)]\s*(.+)$/gm)?.map((title: string) => title.replace(/^\d+[\.\)]\s*/, '').trim()) || [];

    // Filter out anything longer than 4 words just in case
    const shortTitles = titles.filter((title: string) => title.split(/\s+/).length <= 4);

    return NextResponse.json({ titles: shortTitles });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}