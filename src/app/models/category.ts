export interface Category {
    id?: string;
    name: string;
    icon: string;
    color: string;
    type: 'income' | 'expense';
    createdBy?: string;
    createdAt?: Date;
    updatedBy?: string;
    updatedAt?: Date;
}