import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    const { lessonId } = await params;
    try {
        if (!lessonId) {
            return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
        }

        const lessonDocRef = doc(db, 'lessons', lessonId);
        const lessonDoc = await getDoc(lessonDocRef);

        if (!lessonDoc.exists()) {
            return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
        }

        const lessonData = { id: lessonDoc.id, ...lessonDoc.data() };
        return NextResponse.json(lessonData);

    } catch (error) {
        console.error(`Error fetching lesson ${lessonId}:`, error);
        return NextResponse.json(
            { error: 'Failed to fetch lesson' },
            { status: 500 }
        );
    }
} 