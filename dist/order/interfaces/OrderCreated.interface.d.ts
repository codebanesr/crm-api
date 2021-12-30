export interface OrderCreated {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: "INR";
    receipt: string;
    offer_id: string | null;
    status: string;
    attempts: number;
    notes: {
        notes_key_1: string;
        notes_key_2: string;
    };
    created_at: number;
}
