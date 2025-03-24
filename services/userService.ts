import { supabase } from '@/utils/supabase';
import { User } from '@/models/user';

// Lire tous les utilisateurs
export const getAllUsers = async () => {
    const { data, error } = await supabase.from('utilisateurs').select('*');

    if (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error.message);
        return { error };
    }

    return { data };
};

// Lire un utilisateur par ID
export const getUserById = async (id: string) => {
    const { data, error } = await supabase
        .from('utilisateurs')
        .select('*')
        .eq('id', id)
        .single(); // Retourne un seul utilisateur

    if (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error.message);
        return { error };
    }

    return { data };
};

// Récupérer l'utilisateur connecté
export const getCurrentUser = async () => {
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error('Erreur lors de la récupération de l\'utilisateur connecté :', authError?.message);
        return { error: authError || new Error('Aucun utilisateur connecté') };
    }

    // Utilise l'ID de l'utilisateur provenant de Supabase Auth
    const { data, error } = await supabase
        .from('utilisateurs')
        .select('*')
        .eq('id', user.id) // Utilise l'ID de Supabase Auth
        .single();

    if (error) {
        console.error('Erreur lors de la récupération des détails utilisateur :', error.message);
        return { error };
    }

    return { data };
};

// Mettre à jour un utilisateur
export const updateUser = async (id: string, updates: Partial<Omit<User, 'id' | 'created_at'>>) => {
    const { data, error } = await supabase
        .from('utilisateurs')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur :', error.message);
        return { error };
    }

    return { data: data[0] };
};

// Supprimer un utilisateur
export const deleteUser = async (id: string) => {
    const { data, error } = await supabase
        .from('utilisateurs')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur :', error.message);
        return { error };
    }

    return { message: 'Utilisateur supprimé avec succès', data };
};

export default { getAllUsers, getUserById, getCurrentUser, updateUser, deleteUser };
