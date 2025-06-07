import { ServiceAccount } from 'firebase-admin';

export const adminConfig: ServiceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
}; 