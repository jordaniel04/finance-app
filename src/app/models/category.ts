export interface Category {
    id?: string;
    name: string;
    icon?: string;
    color?: string;
    type: 'income' | 'expense';
    userId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}