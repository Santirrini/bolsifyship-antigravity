'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';

interface User {
    id: number;
    email: string;
    full_name: string;
    is_active: boolean;
    is_admin: number;
    role: string;
}

interface AuthContextType {
    user: User | null;
    login: () => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await api.get('/auth/users/me');
                setUser(res.data);
            } catch (error) {
                // Not logged in or session expired
                setUser(null);
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async () => {
        // Refresh user data immediately
        try {
            const res = await api.get('/auth/users/me');
            const userData = res.data;
            setUser(userData);

            if (userData.role === 'admin') {
                router.push('/admin');
            } else if (userData.role === 'seller') {
                router.push('/seller');
            } else {
                router.push('/');
            }
        } catch (err) {
            console.error("Login fetch user failed", err);
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout failed", error);
        }
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
