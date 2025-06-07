"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Upload, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../shared/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';

export default function UploadLessonButton() {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { firebaseUser } = useAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file first!');
      return;
    }
    if (!firebaseUser) {
      toast.error('You must be logged in to upload a lesson.');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    const toastId = toast.loading('Our AI is building your lesson... This may take a few minutes! 🤖');

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process PDF');
      }

      const result = await response.json();
      
      toast.success('Your lesson is ready! ✨', { id: toastId });
      setSelectedFile(null);
      setOpen(false);
      router.refresh(); // Refresh the page to show the new lesson
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Error: ${error.message}`, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg">
          <Upload className="mr-2 h-5 w-5" />
          Create New Lesson
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-200">
        <DialogHeader>
          <DialogTitle>Create Lesson from PDF</DialogTitle>
          <DialogDescription>
            Upload a page from your textbook and our AI will create a fun, interactive lesson for you.
          </DialogDescription>
        </DialogHeader>
        {isUploading ? (
            <div className='flex flex-col items-center justify-center py-10'>
                <LoadingSpinner />
                <p className='mt-4 text-center text-gray-600'>Analyzing your PDF and creating activities...</p>
            </div>
        ) : (
            <div className="grid gap-4 py-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="pdf-upload">PDF File</Label>
                    <div 
                        className="flex items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {selectedFile ? (
                            <div className='text-center text-green-600'>
                                <FileText className='mx-auto h-8 w-8 mb-2' />
                                <p>{selectedFile.name}</p>
                            </div>
                        ) : (
                            <div className='text-center text-gray-500'>
                                <Upload className='mx-auto h-8 w-8 mb-2' />
                                <p>Click to browse or drag & drop</p>
                            </div>
                        )}
                    </div>
                    <Input id="pdf-upload" type="file" accept=".pdf" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                </div>
            </div>
        )}
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} disabled={!selectedFile || isUploading} className="w-full bg-brand-accent hover:bg-brand-accent/90">
            Create Lesson
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}