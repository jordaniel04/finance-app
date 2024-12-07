import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Transaction {
  id?: string;
  type: 'income' | 'expense';
  categoryId: string;
  amount: number;
  description: string;
  date: Date;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  constructor(private firestore: Firestore) {}

  addTransaction(transaction: Transaction): Promise<void> {
    const transactionsRef = collection(this.firestore, 'transactions');
    return addDoc(transactionsRef, {
      ...transaction,
      date: new Date(transaction.date)
    }).then();
  }

  getTransactions(): Observable<Transaction[]> {
    const transactionsRef = collection(this.firestore, 'transactions');
    const q = query(transactionsRef, orderBy('date', 'desc'));
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(transactions => transactions as Transaction[])
    );
  }
}
