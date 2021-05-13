declare class OrderMeta {
    perUserRate: number;
    discount: number;
    seats: number;
    total: number;
    months: number;
}
export declare class CreateOrderDto {
    amount: number;
    currency: string;
    notes: OrderMeta;
}
export {};
