import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { Lesson } from '@/lib/types';

interface SubmissionData {
  lessonId: string;
  userId: string;
  answers: { [key: string]: string };
}

export async function POST(request: NextRequest) {
  try {
    const { lessonId, userId, answers }: SubmissionData = await request.json();

    if (!lessonId || !userId || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch the lesson to get correct answers
    const lessonDoc = await adminDb.collection('lessons').doc(lessonId).get();
    if (!lessonDoc.exists) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }
    const lesson = lessonDoc.data() as Lesson;

    // 2. Evaluate answers and calculate score
    let score = 0;
    const allQuestions = [...(lesson.comprehensionQuestions || []), ...(lesson.exercises || [])];
    
    for (const question of allQuestions) {
      const questionId = 'question' in question ? question.question : question.instruction;
      if (answers[questionId] === question.correctAnswer) {
        score++;
      }
    }
    const totalQuestions = allQuestions.length;
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    // 3. Save submission to Firestore
    const submission = {
      lessonId,
      userId,
      answers,
      score,
      totalQuestions,
      percentage,
      submittedAt: Timestamp.now(),
    };

    const submissionRef = await adminDb.collection('submissions').add(submission);

    return NextResponse.json({ 
      submissionId: submissionRef.id, 
      message: 'Submission successful!',
      score,
      totalQuestions
    });

  } catch (error: any) {
    console.error('Error processing submission:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process submission' },
      { status: 500 }
    );
  }
} 