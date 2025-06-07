"use client";

import React, { useEffect, useState } from 'react';
import { User, Submission } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export default function ProgressPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = React.use(params);
  const { firebaseUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!firebaseUser) return;
      try {
        const token = await firebaseUser.getIdToken();
        const response = await fetch(`/api/progress/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch progress.');
        }

        const data = await response.json();
        setUser(data.user);
        setSubmissions(data.submissions);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [firebaseUser, userId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!user) return notFound();

  const chartData = submissions.map(s => ({
    name: s.lesson?.title.substring(0, 15) + '...' || 'Lesson',
    score: s.percentage,
    date: format(new Date(s.submittedAt.seconds * 1000), 'MMM d'),
  })).reverse();
  
  const averageScore = submissions.reduce((acc, s) => acc + s.percentage, 0) / submissions.length;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-brand-primary mb-2">
        {`${user.displayName}'s Progress`}
      </h1>
      <p className="text-gray-500 mb-8">{user.email}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Lessons Completed</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {submissions.length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Score</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {averageScore.toFixed(1)}%
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#8884d8" name="Score (%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
       <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Submission History</h2>
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <CardTitle>{submission.lesson?.title || 'Lesson'}</CardTitle>
                <p className="text-sm text-gray-500">
                  {format(new Date(submission.submittedAt.seconds * 1000), 'MMMM d, yyyy')}
                </p>
              </CardHeader>
              <CardContent>
                <p>Score: <strong>{submission.score}/{submission.totalQuestions}</strong> ({submission.percentage.toFixed(1)}%)</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 