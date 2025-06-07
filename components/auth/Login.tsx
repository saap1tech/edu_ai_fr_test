"use client";

import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Auth state is handled by the AuthProvider, which will redirect
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-brand-primary">Welcome to EduAI</h1>
          <p className="mt-2 text-gray-600">
            Sign in to continue your learning adventure!
          </p>
        </div>
        <Button
          onClick={handleGoogleSignIn}
          className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
} 