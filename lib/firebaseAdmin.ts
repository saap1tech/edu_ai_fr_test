import admin from 'firebase-admin';
import { adminConfig } from './firebaseAdminConfig';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore(); 