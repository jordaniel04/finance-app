import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, collectionData, Timestamp, where, updateDoc, deleteDoc, doc, CollectionReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private readonly transactionsCollection: CollectionReference;

  constructor(private readonly firestore: Firestore) {
    this.transactionsCollection = collection(this.firestore, 'transactions');
  }

  addTransaction(transaction: Transaction): Promise<void> {
    const date = new Date(transaction.date);
    
    return addDoc(this.transactionsCollection, {
      ...transaction,
      date: Timestamp.fromDate(date)
    }).then();
  }

  getTransactions(year?: number, month?: number): Observable<Transaction[]> {
    let q = query(this.transactionsCollection, orderBy('date', 'desc'));

    if (year !== undefined && month !== undefined) {
      const startDate = new Date(year, month, 1, 0, 0, 0);
      const endDate = new Date(year, month + 1, 0, 23, 59, 59);
      
      q = query(
        this.transactionsCollection,
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

  updateTransaction(transactionId: string, transaction: Partial<Transaction>) {
    const docRef = doc(this.transactionsCollection, transactionId);
    return updateDoc(docRef, transaction);
  }

  deleteTransaction(transactionId: string) {
    const docRef = doc(this.transactionsCollection, transactionId);
    return deleteDoc(docRef);
  }
}
