import { Event } from '@/models/event';

// Base URL et clé d'API de Supabase
const BASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const API_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Fonction pour vérifier si la date est passée
const checkIfDateIsPassed = (date: string): boolean => {
    const eventDate = new Date(date);
    const currentDate = new Date();
    return eventDate < currentDate; // Retourne true si la date est passée
};

// Récupérer tous les événements
export const fetchEvents = async (): Promise<Event[]> => {
    try {
        const response = await fetch(`${BASE_URL}/rest/v1/evenements`, {
            method: 'GET',
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur lors du chargement des événements : ${response.status}`);
        }

        const data = await response.json();
        return data.map((event: Event) => ({
            ...event,
            est_passe: checkIfDateIsPassed(event.date),
        })) as Event[];
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Récupérer un événement par ID
export const getEventById = async (id: string): Promise<{ data?: Event; error?: any }> => {
    try {
        const response = await fetch(`${BASE_URL}/rest/v1/evenements?id=eq.${id}`, {
            method: 'GET',
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération de l'événement : ${response.status}`);
        }

        const [data] = await response.json();
        return { data: { ...data, est_passe: checkIfDateIsPassed(data.date) } };
    } catch (error) {
        console.error(error);
        return { error };
    }
};

// Mettre à jour les places restantes d'un événement et le booléen est_complet
export const updateEventPlaces = async (
    eventId: string,
    placesChange: number
): Promise<{ success: boolean; error?: any }> => {
    try {
        // Étape 1 : Récupérer l'événement actuel
        const response = await fetch(`${BASE_URL}/rest/v1/evenements?id=eq.${eventId}`, {
            method: 'GET',
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération de l'événement : ${response.status}`);
        }

        const [event] = await response.json();
        if (!event) {
            throw new Error('Événement introuvable');
        }

        // Étape 2 : Calculer la nouvelle valeur
        const newPlacesRestantes = event.places_restantes + placesChange;

        if (newPlacesRestantes < 0) {
            throw new Error('Le nombre de places restantes ne peut pas être négatif.');
        }

        const estComplet = newPlacesRestantes === 0;

        // Étape 3 : Mettre à jour les places restantes et le booléen est_complet
        const updateResponse = await fetch(`${BASE_URL}/rest/v1/evenements?id=eq.${eventId}`, {
            method: 'PATCH',
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                places_restantes: newPlacesRestantes,
                est_complet: estComplet,
            }),
        });

        if (!updateResponse.ok) {
            throw new Error(`Erreur lors de la mise à jour : ${updateResponse.status}`);
        }

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error };
    }
};

export default { fetchEvents, getEventById, updateEventPlaces };
