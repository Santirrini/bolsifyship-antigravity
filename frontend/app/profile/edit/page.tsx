"use client";

import React, { useEffect, useState } from 'react';
import ProfileInfo from '@/components/profile/ProfileInfo';
import { userService } from '@/services/user';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditProfilePage() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const data = await userService.getProfile();
            setUser(data);
        } catch (error) {
            router.push('/login');
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link href="/profile" className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <ArrowLeft size={20} className="mr-2" />
                        Volver al Perfil
                    </Link>
                </div>
                <ProfileInfo user={user} onUpdate={loadUser} />
            </div>
        </div>
    );
}
