import { Billet } from './billet';

export type Reservation = {
    id: string; // UUID (Clé primaire)
    utilisateur_id: string; // UUID (Clé étrangère vers utilisateurs)
    evenement_id: string; // UUID (Clé étrangère vers evenements)
    nb_billets: number; // Nombre total de billets
    numero_conf: string; // Numéro de confirmation
    created_at: string; // Timestamp de la création
    billets?: Billet[]; // Liste des billets associés
};
