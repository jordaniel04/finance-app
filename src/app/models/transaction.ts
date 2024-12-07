export interface Transaction {
    id?: string;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    date: Date;
    categoryId: string;
    userId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TransactionGroup {
    date: Date;
    transactions: Transaction[];
    totalIncome: number;
    totalExpense: number;
    expanded: boolean;
}