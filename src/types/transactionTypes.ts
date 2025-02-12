export interface Transaction {
    id: string;
    date: string;
    amount: number;
    account_number: string;
    transaction_type: string;
    payment_method: string;
    status: string;
    remarks: string;
}
