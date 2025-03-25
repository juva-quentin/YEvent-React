export type Billet = {
    id: string;
    reservation_id: string;
    numero_billet: string;
    created_at: string;
    is_used: boolean;
    validated_at?: string | null;
};
