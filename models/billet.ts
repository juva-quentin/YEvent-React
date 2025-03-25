export type Billet = {
    id: string; // UUID (Clé primaire)
    reservation_id: string; // UUID (Clé étrangère vers reservations)
    numero_billet: string; // Numéro unique du billet
    created_at: string; // Timestamp de la création du billet
    is_used: boolean; // Indique si le billet a été utilisé
};
