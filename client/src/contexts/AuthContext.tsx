'use client';
import { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { User } from '../types/auth.types';

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData : User, token : string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('access_token'); 

        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = (userData : User, token : string) => {
        setUser(userData);
        setIsAuthenticated(true);
        Cookies.set('access_token', token);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        Cookies.remove('access_token');
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

   