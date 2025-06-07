import admin from 'firebase-admin';
import { adminConfig } from './firebaseAdminConfig';

try {
  if (!admin.apps.length) {
    console.log('Initializing Firebase Admin with project:', adminConfig.projectId);
    admin.initializeApp({
      credential: admin.credential.cert(adminConfig),
    });
    console.log('Firebase Admin initialized successfully');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  if (error instanceof Error) {
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
  }
  throw error;
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore(); 