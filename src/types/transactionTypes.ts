export interface Transaction {
    id: number;
    payment_method: string;
    amount: number;
    date: string;
    badges: string[];
    isChild?: boolean;
}
