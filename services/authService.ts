import { supabase } from '@/utils/supabase';

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
        // 3. Ajouter l'utilisateur dans la table 'utilisateurs'
        const { error: dbError } = await supabase
            .from('utilisateurs')
            .insert([{ id: user.id, email, nom, created_at: new Date() }]);

        if (dbError) {
            console.error('Erreur lors de la création de l\'utilisateur dans la base de données :', dbError.message);
            return { error: dbError };
        }
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