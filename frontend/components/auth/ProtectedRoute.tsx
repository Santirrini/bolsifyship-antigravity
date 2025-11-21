'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            // If not authenticated, redirect to home
            if (!user) {
                router.push('/');
                return;
            }

            // If user doesn't have the required role, redirect to home
            if (!allowedRoles.includes(user.role)) {
                router.push('/');
                return;
            }
        }
    }, [user, loading, allowedRoles, router]);

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400">Verificando acceso...</p>
                </div>
            </div>
        );
    }

    // Don't render anything if not authenticated or wrong role
    if (!user || !allowedRoles.includes(user.role)) {
        return null;
    }

    // Render protected content
    return <>{children}</>;
}
