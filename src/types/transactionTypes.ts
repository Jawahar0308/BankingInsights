export interface Transaction {
    childTable: any;
    badges: string[];
    id: number;  // or number if you use numbers
    amount: number;
    status: string;
    payment_method: string;
    // Badges: string;
    relatedTransactions?: { id: number; date: string; amount: number; type: string; status: string }[];  // Add relatedTransactions
}


export interface LoginUser {
    id: number;
    email: String;
    password: string;
    accountNumber: string;
}
