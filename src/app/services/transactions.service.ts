import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, query, where, getDocs, orderBy } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  constructor(private readonly firestore: Firestore) {}

  getTransactions(): Observable<Transaction[]> {
    const transactionsRef = collection(this.firestore, 'transactions');
    return collectionData(transactionsRef, { idField: 'id' }) as Observable<Transaction[]>;
  }

  addTransaction(transaction: Transaction): Observable<void> {
    const transactionsRef = collection(this.firestore, 'transactions');
    return from(addDoc(transactionsRef, {
      ...transaction,
      createdAt: new Date(),
      updatedAt: new Date()
    })).pipe(map(() => void 0));
  }
}
