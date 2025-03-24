import { supabase } from '@/utils/supabase';
import { Billet } from '@/models/billet';

// Récupérer les billets pour une réservation donnée
export const getBilletsByReservationId = async (
    reservationId: string
): Promise<{ data?: Billet[]; error?: any }> => {
    const { data, error } = await supabase
        .from('billets')
        .select('*')
        .eq('reservation_id', reservationId);

    if (error) {
        console.error('Erreur lors de la récupération des billets :', error.message);
        return { error };
    }

    return { data };
};

export default { getBilletsByReservationId };
