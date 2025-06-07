"use client";

import { useState } from 'react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';  
import { Github, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserAuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUserDoc = async (user: User) => {
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }, { merge: true }); // Merge ensures we don't overwrite existing data
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      await handleUserDoc(result.user);
      toast.success("Welcome! 🎉");
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign in with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Button variant="outline" type="button" onClick={handleGoogleSignIn} disabled={isLoading}>
        {isLoading ? (
          <div className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-primary"></div>
        ) : (
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-67.4 64.8C295.6 98.3 268.5 80 248 80c-82.3 0-148.9 66.6-148.9 176s66.6 176 148.9 176c94.9 0 132.3-71.4 136.7-108.2H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
        )}
        Sign in with Google
      </Button>
      {/* Email/Password form can be added here if desired */}
    </div>
  );
}