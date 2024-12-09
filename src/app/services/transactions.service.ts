import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, collectionData, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  constructor(private readonly firestore: Firestore) {}

  addTransaction(transaction: Transaction): Promise<void> {
    const transactionsRef = collection(this.firestore, 'transactions');
    return addDoc(transactionsRef, {
      ...transaction,
      date: Timestamp.fromDate(new Date(transaction.date))
    }).then();
  }

  getTransactions(): Observable<Transaction[]> {
    const transactionsRef = collection(this.firestore, 'transactions');
    const q = query(transactionsRef, orderBy('date', 'desc'));
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(transactions => transactions.map(transaction => ({
        ...transaction,
        date: (transaction['date'] as unknown as Timestamp).toDate()
      })) as Transaction[])
    );
  }
}
