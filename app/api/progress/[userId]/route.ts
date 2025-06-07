import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { User, Submission, Lesson } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const adminUserDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    if (!adminUserDoc.exists || adminUserDoc.data()?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId } = await params;
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch the user's details
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const userData = userDoc.data();
    const user: User = {
      uid: userDoc.id,
      email: userData?.email || null,
      displayName: userData?.displayName || null,
      role: userData?.role || 'kid',
    };

    // Fetch the user's submissions
    const submissionsSnapshot = await adminDb.collection('submissions').where('userId', '==', userId).get();

    let submissions: Submission[] = await Promise.all(
      submissionsSnapshot.docs.map(async (doc) => {
        const submissionData = doc.data();
        let lessonData: Lesson | null = null;

        const lessonDoc = await adminDb.collection('lessons').doc(submissionData.lessonId).get();

        if (lessonDoc.exists) {
          lessonData = { id: lessonDoc.id, ...lessonDoc.data() } as Lesson;
        }

        return {
          id: doc.id,
          ...submissionData,
          lesson: lessonData,
        } as Submission;
      })
    );

    // Sort submissions by date, most recent first
    submissions.sort((a, b) => {
      if (a.submittedAt.seconds === b.submittedAt.seconds) {
        return b.submittedAt.nanoseconds - a.submittedAt.nanoseconds;
      }
      return b.submittedAt.seconds - a.submittedAt.seconds;
    });

    return NextResponse.json({ user, submissions });

  } catch (error: any) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user progress' },
      { status: 500 }
    );
  }
} 