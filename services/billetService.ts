import { Billet } from '@/models/billet';

const BASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const API_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Fonction pour récupérer les billets associés à une réservation
export const getBilletsByReservationId = async (
    reservationId: string
): Promise<{ data?: Billet[]; error?: any }> => {
    try {
        // Effectuer une requête GET pour les billets avec le filtre sur l'ID de réservation
        const response = await fetch(`${BASE_URL}/rest/v1/billets?reservation_id=eq.${reservationId}`, {
            method: 'GET',
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        // Vérifier si la réponse est OK
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erreur lors de la récupération des billets :', errorText);
            return { error: new Error('Erreur lors de la récupération des billets.') };
        }

        // Parser la réponse JSON
        const data: Billet[] = await response.json();

        // Retourner les données des billets
        return { data };
    } catch (error) {
        console.error('Erreur lors de la récupération des billets :', error);
        return { error };
    }
};

// ✅ Vérifie si un billet est valide (existe + pas utilisé)
export const verifierBillet = async (
    numero_billet: string
): Promise<{ success: boolean; message: string; billet?: Billet }> => {
    try {
        const response = await fetch(`${BASE_URL}/rest/v1/billets?numero_billet=eq.${numero_billet}`, {
            method: 'GET',
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        const data: Billet[] = await response.json();

        if (!response.ok || data.length === 0) {
            return { success: false, message: 'Billet introuvable' };
        }

        const billet = data[0];

        if (billet.is_used) {
            return { success: false, message: 'Billet déjà utilisé' };
        }

        return { success: true, message: 'Billet valide', billet };
    } catch (error) {
        console.error('Erreur lors de la vérification du billet :', error);
        return { success: false, message: 'Erreur lors de la vérification du billet' };
    }
};

// ✅ Valide un billet (met is_used à true)
export const validerBillet = async (billetId: string): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await fetch(`${BASE_URL}/rest/v1/billets?id=eq.${billetId}`, {
            method: 'PATCH',
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ is_used: true }),
        });

        if (!response.ok) {
            return { success: false, message: 'Erreur lors de la validation du billet' };
        }

        return { success: true, message: 'Billet validé avec succès' };
    } catch (error) {
        console.error('Erreur lors de la validation du billet :', error);
        return { success: false, message: 'Erreur interne lors de la validation' };
    }
};

export default { getBilletsByReservationId, verifierBillet, validerBillet };
