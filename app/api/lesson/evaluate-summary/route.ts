import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

const EVALUATION_PROMPT = `You are a supportive French language teacher for children aged 6-12.
Evaluate the student's summary of the French text and provide encouraging feedback.
Consider:
1. Content accuracy (main ideas covered)
2. Grammar and vocabulary usage
3. Clarity of expression
4. Areas for improvement

Provide feedback in this JSON format:
{
  "score": number (1-5 stars),
  "feedback": string (encouraging message with specific praise and gentle suggestions),
  "corrections": array of {original: string, corrected: string, explanation: string}
}

Keep the feedback positive, specific, and easy to understand for children.
Use emojis in the feedback message.`;

export async function POST(request: NextRequest) {
  try {
    const { userSummary, originalText } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const result = await model.generateContent([
      EVALUATION_PROMPT,
      `Student's summary: ${userSummary}\nOriginal text: ${originalText}`
    ]);
    
    const evaluation = JSON.parse(result.response.text());

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Error evaluating summary:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate summary' },
      { status: 500 }
    );
  }
}