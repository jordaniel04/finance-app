export interface Category {
    id?: string;
    name: string;
    type: 'income' | 'expense';
    userId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}