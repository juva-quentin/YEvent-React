import { Reservation } from "@/models/reservation";
import { getCurrentUserId } from "@/services/userService";
import {updateEventPlaces} from "@/services/eventService";
import supabase from "@/utils/supabase";

const BASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const API_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const headers = {
    'Content-Type': 'application/json',
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
};

// Créer une réservation et ses billets associés
export const createReservation = async (
    evenement_id: string,
    nb_billets: number
): Promise<{ data?: Reservation; error?: any }> => {
    // Récupération de l'ID utilisateur
    const { userId, error: userError } = await getCurrentUserId();
    if (userError || !userId) {
        console.error('Erreur lors de la récupération de l\'ID utilisateur :', userError?.message || 'ID introuvable');
        return { error: 'Erreur lors de la récupération de l\'ID utilisateur' };
    }

    // Génération d'un numéro de confirmation unique
    const numero_conf = `CONF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Création de la réservation
    const { data: reservation, error } = await supabase
        .from('reservations')
        .insert([{ utilisateur_id: userId, evenement_id, nb_billets, numero_conf }])
        .select()
        .single();

    if (error || !reservation) {
        console.error('Erreur lors de la création de la réservation :', error?.message);
        return { error };
    }

    // Création des billets associés
    const billets = Array.from({ length: nb_billets }, (_, index) => ({
        reservation_id: reservation.id,
        numero_billet: `${numero_conf}-${index + 1}`,
    }));

    const { error: billetError } = await supabase.from('billets').insert(billets);
    if (billetError) {
        console.error('Erreur lors de la création des billets :', billetError.message);
        return { error: billetError };
    }

    // Mettre à jour les places restantes
    const { success, error: updateError } = await updateEventPlaces(evenement_id, -nb_billets);
    if (!success) {
        return { error: updateError };
    }

    return { data: reservation };
};

// Annuler une réservation et ses billets
export const cancelReservation = async (reservation_id: string): Promise<{ success: boolean; error?: any }> => {
    // Récupérer les informations de la réservation
    const { data: reservation, error: fetchError } = await supabase
        .from('reservations')
        .select('evenement_id, nb_billets')
        .eq('id', reservation_id)
        .single();

    if (fetchError || !reservation) {
        console.error('Erreur lors de la récupération de la réservation :', fetchError?.message);
        return { success: false, error: 'Réservation introuvable' };
    }

    // Supprimer les billets associés
    const { error: billetError } = await supabase
        .from('billets')
        .delete()
        .eq('reservation_id', reservation_id);

    if (billetError) {
        console.error('Erreur lors de la suppression des billets :', billetError.message);
        return { success: false, error: billetError };
    }

    // Supprimer la réservation
    const { error: reservationError } = await supabase
        .from('reservations')
        .delete()
        .eq('id', reservation_id);

    if (reservationError) {
        console.error('Erreur lors de la suppression de la réservation :', reservationError.message);
        return { success: false, error: reservationError };
    }

    // Mettre à jour les places restantes
    const { success, error: updateError } = await updateEventPlaces(reservation.evenement_id, reservation.nb_billets);
    if (!success) {
        return { success: false, error: updateError };
    }

    return { success: true };
};

// Voir les réservations d'un utilisateur
export const getUserReservations = async (utilisateur_id: string): Promise<{ data?: Reservation[]; error?: any }> => {
    try {
        const response = await fetch(`${BASE_URL}/rest/v1/reservations?utilisateur_id=eq.${utilisateur_id}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des réservations utilisateur.');
        }

        const data = await response.json();
        return { data };
    } catch (error) {
        console.error(error);
        return { error };
    }
};

export default {
    createReservation,
    cancelReservation,
    getUserReservations,
};
