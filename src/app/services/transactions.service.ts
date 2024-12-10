import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, collectionData, Timestamp, where } from '@angular/fire/firestore';
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
    const date = new Date(transaction.date);
    
    return addDoc(transactionsRef, {
      ...transaction,
      date: Timestamp.fromDate(date)
    }).then();
  }

  getTransactions(year?: number, month?: number): Observable<Transaction[]> {
    const transactionsRef = collection(this.firestore, 'transactions');
    let q = query(transactionsRef, orderBy('date', 'desc'));

    if (year !== undefined && month !== undefined) {
      const startDate = new Date(year, month, 1, 0, 0, 0);
      const endDate = new Date(year, month + 1, 0, 23, 59, 59);
      
      q = query(
        transactionsRef,
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'desc')
      );
    }
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(transactions => transactions.map(transaction => ({
        ...transaction,
        date: (transaction['date'] as unknown as Timestamp).toDate()
      })) as Transaction[])
    );
  }
}
