import { supabase } from '@/utils/supabase';
import { Event } from '@/models/event';

// Récupérer tous les événements
export const fetchEvents = async (): Promise<Event[]> => {
    const { data, error } = await supabase.from('evenements').select('*');

    if (error) {
        console.error('Erreur lors du chargement des événements :', error.message);
        return [];
    }

    return data as Event[];
};

// Récupérer un événement par ID
export const getEventById = async (id: string) => {
    const { data, error } = await supabase
        .from('evenements')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Erreur lors de la récupération de l\'événement :', error.message);
        return { error };
    }

    return { data };
};

// Mettre à jour les places restantes d'un événement et le booléen est_complet
export const updateEventPlaces = async (
    eventId: string,
    placesChange: number
): Promise<{ success: boolean; error?: any }> => {
    // Étape 1 : Récupérer l'événement actuel
    const { data: event, error: fetchError } = await supabase
        .from('evenements')
        .select('places_restantes, est_complet')
        .eq('id', eventId)
        .single();

    if (fetchError || !event) {
        console.error('Erreur lors de la récupération de l\'événement :', fetchError?.message);
        return { success: false, error: 'Événement introuvable' };
    }

    // Étape 2 : Calculer la nouvelle valeur
    const newPlacesRestantes = event.places_restantes + placesChange;

    if (newPlacesRestantes < 0) {
        return { success: false, error: 'Le nombre de places restantes ne peut pas être négatif.' };
    }

    // Déterminer si l'événement est complet
    const estComplet = newPlacesRestantes === 0;

    // Étape 3 : Mettre à jour les places restantes et le booléen est_complet
    const { error: updateError } = await supabase
        .from('evenements')
        .update({
            places_restantes: newPlacesRestantes,
            est_complet: estComplet
        })
        .eq('id', eventId);

    if (updateError) {
        console.error('Erreur lors de la mise à jour des places restantes :', updateError.message);
        return { success: false, error: updateError.message };
    }

    return { success: true };
};

export default { fetchEvents, getEventById, updateEventPlaces };
