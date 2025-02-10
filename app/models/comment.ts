export type Comment = {
    id: string; // UUID
    utilisateur_id: string; // UUID (Clé étrangère vers utilisateurs)
    evenement_id: string; // UUID (Clé étrangère vers evenements)
    texte: string;
    created_at: string; // Timestamp
};
