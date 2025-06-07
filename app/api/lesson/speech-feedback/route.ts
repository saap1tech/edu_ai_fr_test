import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

const FEEDBACK_PROMPT = `You are a friendly and encouraging French language teacher for children aged 6-12.
Analyze the student's pronunciation of the French word or phrase and provide constructive feedback.
Focus on:
1. Overall accuracy
2. Specific sounds that need improvement
3. Positive reinforcement
4. A simple tip for improvement

Keep the feedback brief, encouraging, and easy to understand for children.
Use emojis to make it more engaging.`;

export async function POST(request: NextRequest) {
  try {
    const { audioTranscript, correctPronunciation } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const result = await model.generateContent([
      FEEDBACK_PROMPT,
      `Student's pronunciation: ${audioTranscript}\nCorrect pronunciation: ${correctPronunciation}`
    ]);
    
    const feedback = result.response.text();

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Error generating speech feedback:', error);
    return NextResponse.json(
      { error: 'Failed to generate feedback' },
      { status: 500 }
    );
  }
}