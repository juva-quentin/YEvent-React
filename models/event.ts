export type Event = {
    id: string;
    titre: string;
    description: string | null;
    lieu: string;
    date: string;
    prix: number;
    capacite: number;
    places_restantes: number;
    est_complet: boolean;
    coordonnees: { latitude: number; longitude: number };
    est_passe?: boolean;
};
