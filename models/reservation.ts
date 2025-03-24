export type Reservation = {
    id: string; // UUID
    utilisateur_id: string; // UUID (Clé étrangère vers utilisateurs)
    evenement_id: string; // UUID (Clé étrangère vers evenements)
    nb_billets: number; // int4
    numero_conf: string; // Texte pour numéro de confirmation
    created_at: string; // Timestamp
};
