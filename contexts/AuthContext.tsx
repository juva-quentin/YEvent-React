import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

type AuthContextType = {
    user: any | null;
    loading: boolean;
    signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Vérifie si un utilisateur est connecté au démarrage
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
            setLoading(false);
        };

        // Écoute les changements d'authentification
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null);
            setLoading(false);
        });

        checkUser().then(r => console.log('The user is:', user));

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;