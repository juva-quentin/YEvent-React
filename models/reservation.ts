import { Billet } from './billet';

export type Reservation = {
    id: string;
    utilisateur_id: string;
    evenement_id: string;
    nb_billets: number;
    numero_conf: string;
    created_at: string;
    billets?: Billet[];
};
