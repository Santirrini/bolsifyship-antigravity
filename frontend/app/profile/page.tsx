"use client";

import React, { useEffect, useState } from 'react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileMenu from '@/components/profile/ProfileMenu';
import LogoutButton from '@/components/profile/LogoutButton';
import { userService } from '@/services/user';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const data = await userService.getProfile();
                if (!data) {
                    router.push('/');
                    return;
                }
                setUser(data);
            } catch (error) {
                console.error("Error loading profile:", error);
                router.push('/');
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-neutral-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-neutral-900 dark:text-white mb-8 tracking-tight">
                    Mi Perfil
                </h1>

                <ProfileHeader
                    name={user.full_name || "Usuario"}
                    email={user.email}
                />

                <ProfileMenu />

                <LogoutButton />

                <div className="mt-12 text-center">
                    <p className="text-xs text-neutral-400 font-medium">Bolsifyshop v1.0.0</p>
                    <p className="text-[10px] text-neutral-300 mt-1">© 2024 Todos los derechos reservados</p>
                </div>
            </div>
        </div>
    );
}
