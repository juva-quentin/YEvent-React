import { supabase } from '@/utils/supabase';
import { User } from '@/models/user';

const BASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const API_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const headers = {
    'Content-Type': 'application/json',
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
};

// Lire tous les utilisateurs
export const getAllUsers = async () => {
    try {
        const response = await fetch(`${BASE_URL}/rest/v1/utilisateurs`, { headers });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des utilisateurs.');
        }

        const data = await response.json();
        return { data };
    } catch (error) {
        console.error(error);
        return { error };
    }
};

// Lire un utilisateur par ID
export const getUserById = async (id: string) => {
    try {
        const response = await fetch(`${BASE_URL}/rest/v1/utilisateurs?id=eq.${id}`, { headers });

        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération de l'utilisateur avec ID : ${id}`);
        }

        const data = await response.json();
        return { data: data[0] };
    } catch (error) {
        console.error(error);
        return { error };
    }
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

    const userId = user.id;

    const response = await fetch(`${BASE_URL}/rest/v1/utilisateurs?id=eq.${userId}`, { headers });

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des détails utilisateur.');
    }

    const data = await response.json();
    return { data: data[0] };
};

// Mettre à jour un utilisateur
export const updateUser = async (id: string, updates: Partial<Omit<User, 'id' | 'created_at'>>) => {
    try {
        const response = await fetch(`${BASE_URL}/rest/v1/utilisateurs?id=eq.${id}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(updates),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour de l\'utilisateur.');
        }

        const data = await response.json();
        return { data: data[0] };
    } catch (error) {
        console.error(error);
        return { error };
    }
};

// Supprimer un utilisateur
export const deleteUser = async (id: string) => {
    try {
        const response = await fetch(`${BASE_URL}/rest/v1/utilisateurs?id=eq.${id}`, {
            method: 'DELETE',
            headers,
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression de l\'utilisateur.');
        }

        return { message: 'Utilisateur supprimé avec succès' };
    } catch (error) {
        console.error(error);
        return { error };
    }
};

// Obtenir l'ID de l'utilisateur connecté
export const getCurrentUserId = async (): Promise<{ userId?: string; error?: any }> => {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        console.error('Erreur lors de la récupération de l\'ID utilisateur :', error?.message || 'Aucun utilisateur connecté');
        return { error: error || new Error('Aucun utilisateur connecté') };
    }

    return { userId: user.id };
};

export default {
    getAllUsers,
    getUserById,
    getCurrentUser,
    getCurrentUserId,
    updateUser,
    deleteUser
};
