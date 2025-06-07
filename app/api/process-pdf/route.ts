import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

const LESSON_PROMPT = `You are an expert French language teacher for children aged 6-12. 
Your task is to transform this French text into an engaging, interactive lesson.
Create a structured response in JSON format that MUST EXACTLY follow this structure:

{
  "title": "A child-friendly title in French",
  "content": [
    "First paragraph of the text, broken down for readability",
    "Second paragraph of the text",
    "Third paragraph of the text",
    "Fourth paragraph of the text",
    "Fifth paragraph with a conclusion"
  ],
  "vocabulary": [
    {
      "word": "French word",
      "translation": "English translation",
      "pronunciation": "IPA pronunciation like /word/",
      "exampleSentence": "A simple French sentence using the word"
    }
  ],
  "comprehensionQuestions": [
    {
      "question": "Question in French?",
      "answers": [
        "First possible answer in French",
        "Second possible answer in French",
        "Third possible answer in French",
        "Fourth possible answer in French"
      ],
      "correctAnswer": "The correct answer (must be exactly one of the answers)"
    }
  ],
  "exercises": [
    {
      "type": "grammar",
      "instruction": "Clear instruction in French",
      "explanation": "Explanation of the grammar rule",
      "options": ["option1", "option2", "option3"],
      "correctAnswer": "The correct option (must be one of the options)"
    },
    {
      "type": "spelling",
      "instruction": "Spelling exercise instruction",
      "explanation": "Explanation of the spelling rule",
      "correctAnswer": "The correct spelling"
    },
    {
      "type": "sentenceOrdering",
      "instruction": "Instruction for ordering words",
      "explanation": "Explanation of sentence structure",
      "words": ["word1", "word2", "word3", "word4", "word5"],
      "correctAnswer": "The correct sentence"
    },
    {
      "type": "vocabulary",
      "instruction": "Vocabulary exercise instruction",
      "explanation": "Explanation of word usage",
      "options": ["option1", "option2", "option3"],
      "correctAnswer": "The correct option"
    }
  ],
  "summary": "A brief summary of the text in French that captures the main points"
}

IMPORTANT RULES:
1. EXACTLY follow this structure - do not add or remove any fields
2. For comprehensionQuestions, ALWAYS provide 4 possible answers
3. For exercises, ALWAYS include all 4 types: grammar, spelling, sentenceOrdering, and vocabulary
4. Make content child-friendly and engaging
5. Use clear, simple French appropriate for children
6. Ensure all correctAnswer values exactly match one of the provided options
7. For sentenceOrdering, words array should contain individual words that form the correctAnswer when properly ordered

The response must be valid JSON and follow this EXACT structure to match our database schema.`;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get the form data
    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File;
    
    if (!pdfFile) {
      return NextResponse.json(
        { error: 'No PDF file provided' },
        { status: 400 }
      );
    }

    if (!pdfFile.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF file.' },
        { status: 400 }
      );
    }

    // Convert the file to bytes
    const bytes = new Uint8Array(await pdfFile.arrayBuffer());
    const base64Pdf = Buffer.from(bytes).toString('base64');

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const result = await model.generateContent([
      LESSON_PROMPT,
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64Pdf
        }
      }
    ]);
    
    const response = await result.response;
    let text = response.text();
    
    // Clean the response from Gemini
    if (text.startsWith('```json')) {
      text = text.slice(7).trim();
    }
    if (text.endsWith('```')) {
      text = text.slice(0, -3).trim();
    }

    // Validate that the response is valid JSON
    let lessonData;
    try {
      lessonData = JSON.parse(text);
    } catch {
      console.error('Invalid JSON response from Gemini:', text);
      return NextResponse.json(
        { error: 'Failed to generate lesson content' },
        { status: 500 }
      );
    }

    // Add the additional fields needed for Firestore
    const lessonToSave = {
      ...lessonData,
      createdAt: serverTimestamp(),
      pdfFileName: pdfFile.name,
    };

    // Save lesson to Firestore
    const lessonRef = await addDoc(collection(db, 'lessons'), lessonToSave);

    return NextResponse.json({ ...lessonToSave, id: lessonRef.id });
  } catch (err) {
    console.error('Error processing PDF:', err);
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to process PDF' },
      { status: 500 }
    );
  }
}