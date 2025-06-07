"use client";

import { useAuth } from "../../../contexts/AuthContext";
import PageWrapper from "../../../components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Award, Star } from "lucide-react";

export default function ProfilePage() {
    const { userProfile } = useAuth();

    if (!userProfile) {
        return <div>Loading profile...</div>;
    }

    const totalStars = Object.values(userProfile.progress || {}).reduce((acc, p) => acc + p.stars, 0);
    const completedLessons = Object.keys(userProfile.progress || {}).length;

    return (
        <PageWrapper>
            <h1 className="text-4xl font-bold text-brand-primary mb-8">My Profile</h1>
            <Card className="w-full max-w-2xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                    <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-brand-accent">
                        <AvatarImage src={userProfile.photoURL || ''} />
                        <AvatarFallback className="text-4xl">
                            {userProfile.displayName?.charAt(0) || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-3xl">{userProfile.displayName}</CardTitle>
                    <p className="text-gray-500">{userProfile.email}</p>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg p-8">
                    <div className="p-4 bg-blue-100 rounded-lg flex items-center gap-4">
                        <Star className="w-10 h-10 text-yellow-500"/>
                        <div>
                            <p className="font-bold text-2xl">{totalStars}</p>
                            <p className="text-gray-600">Total Stars</p>
                        </div>
                    </div>
                    <div className="p-4 bg-green-100 rounded-lg flex items-center gap-4">
                        <Award className="w-10 h-10 text-green-600"/>
                        <div>
                            <p className="font-bold text-2xl">{completedLessons}</p>
                            <p className="text-gray-600">Lessons Completed</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </PageWrapper>
    );
}