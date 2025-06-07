import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { User } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid Authorization header');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      console.log('Token verified successfully for user:', decodedToken.uid);
      
      // Check if the user is an admin
      const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
      if (!userDoc.exists) {
        console.error('User document not found:', decodedToken.uid);
        return NextResponse.json({ error: 'Forbidden - User not found' }, { status: 403 });
      }
      
      if (userDoc.data()?.role !== 'admin') {
        console.error('User is not an admin:', decodedToken.uid);
        return NextResponse.json({ error: 'Forbidden - Not an admin' }, { status: 403 });
      }
      
      // Fetch all users
      const usersSnapshot = await adminDb.collection('users').get();
      const users: User[] = usersSnapshot.docs.map(doc => doc.data() as User);

      return NextResponse.json(users);
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error in /api/users:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to fetch users: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 