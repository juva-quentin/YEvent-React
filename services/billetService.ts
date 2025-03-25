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

export default { getBilletsByReservationId };
