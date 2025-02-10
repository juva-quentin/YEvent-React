import { supabase } from '@/app/utils/supabase';
import { Event } from '@/app/models/event';

export const fetchEvents = async (): Promise<Event[]> => {
    const { data, error } = await supabase
        .from('evenements')
        .select('*');

    if (error) {
        console.error('Erreur lors du chargement des événements :', error.message);
        return [];
    }

    return data as Event[];
};
