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
        const checkUser = async () => {
            setLoading(true);
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Erreur lors de la récupération de la session :', error.message);
            }

            if (session?.user) {
                setUser(session.user);
                console.log('Session utilisateur trouvée');
            } else {
                setUser(null);
                console.log('Aucune session utilisateur active.');
            }

            setLoading(false);
        };

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null);
            setLoading(false);
        });

        checkUser();

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