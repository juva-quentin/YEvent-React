import { supabase } from '@/utils/supabase';

const BASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const API_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Fonction pour créer un utilisateur avec email et mot de passe
export const signUpWithEmail = async (email: string, password: string, nom: string) => {
    // 1. Inscription via Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        console.error('Erreur lors de l\'inscription :', error.message);
        return { error };
    }

    // 2. Récupérer l'ID utilisateur créé par Supabase Auth
    const user = data.user;
    if (user) {
        await fetch(`${BASE_URL}/rest/v1/utilisateurs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                id: user.id,
                email,
                nom,
                created_at: new Date().toISOString(),
            }),
        });
    }

    return { user: data.user };
};

// Fonction pour se connecter avec email et mot de passe
export const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error('Erreur lors de la connexion :', error.message);
        return { error };
    }

    return { user: data.user };
};

// Fonction pour déconnecter l'utilisateur
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Erreur lors de la déconnexion :', error.message);
        return { error };
    }
    return { success: true };
};


export default { signUpWithEmail, signInWithEmail, signOut };