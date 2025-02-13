export interface Transaction {
    userId: number;
    type: string;
    amount: number;
    date: string;
    description: string;
    category: string;
    payment_method: string;
    status: string;
}

export interface Login {
    id: number;
    email: String;
    password: string;
    accountNumber: string;
}
