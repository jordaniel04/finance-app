import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, collectionData, Timestamp, where, updateDoc, deleteDoc, doc, CollectionReference } from '@angular/fire/firestore';
import { Observable, of, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Transaction } from '../models/transaction';
import { CategoriesService } from './categories.service';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private readonly transactionsCollection: CollectionReference;

  constructor(
    private readonly firestore: Firestore,
    private readonly categoriesService: CategoriesService
  ) {
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

  getBalanceBeforeDate(date: Date): Observable<number> {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
    
    const q = query(
      this.transactionsCollection,
      where('date', '<', Timestamp.fromDate(startOfMonth)),
      orderBy('date', 'desc')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(transactions => {
        return transactions.reduce((balance, transaction: any) => {
          const amount = transaction.amount || 0;
          return balance + (transaction.type === 'income' ? amount : -amount);
        }, 0);
      })
    );
  }

  getTransactionsByMonthAndCategory(year: number, month: number): Observable<any[]> {
    return combineLatest([
      this.getTransactions(year, month),
      this.categoriesService.getCategories()
    ]).pipe(
      map(([transactions, categories]) => {
        const categoryMap = new Map<string, Category>();
        categories.forEach(category => categoryMap.set(category.id!, category));
        
        const categoryTotals = new Map<string, { category: Category, total: number, transactions: Transaction[] }>();
        
        // Inicializar todas las categorías con total 0
        categories.forEach(category => {
          categoryTotals.set(category.id!, { category, total: 0, transactions: [] });
        });
        
        // Sumar transacciones por categoría
        transactions.forEach(transaction => {
          if (categoryTotals.has(transaction.categoryId)) {
            const categoryData = categoryTotals.get(transaction.categoryId)!;
            categoryData.total += transaction.amount * (transaction.type === 'income' ? 1 : -1);
            categoryData.transactions.push(transaction);
          }
        });
        
        // Convertir a array y ordenar por total
        return Array.from(categoryTotals.values())
          .filter(item => item.total !== 0)
          .sort((a, b) => Math.abs(b.total) - Math.abs(a.total));
      })
    );
  }

  getCategoryTotalsByMonthRange(startYear: number, startMonth: number, endYear: number, endMonth: number): Observable<any[]> {
    const months: {year: number, month: number}[] = [];
    
    // Generar el rango de meses
    let currentYear = startYear;
    let currentMonth = startMonth;
    
    while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
      months.push({year: currentYear, month: currentMonth});
      
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }
    
    return combineLatest([
      ...months.map(({year, month}) => this.getTransactions(year, month)),
      this.categoriesService.getCategories()
    ]).pipe(
      map(results => {
        const categories = results[results.length - 1] as Category[];
        const transactionsByMonth = results.slice(0, results.length - 1) as Transaction[][];
        
        const categoryMap = new Map<string, Category>();
        categories.forEach(category => categoryMap.set(category.id!, category));
        
        // Estructura para almacenar los totales por categoría y mes
        const result = categories.map(category => {
          const monthlyData = months.map((month, index) => {
            const transactions = transactionsByMonth[index];
            const categoryTransactions = transactions.filter(t => t.categoryId === category.id);
            const total = categoryTransactions.reduce(
              (sum, t) => sum + t.amount * (t.type === 'income' ? 1 : -1), 
              0
            );
            
            return {
              year: month.year,
              month: month.month,
              total
            };
          });
          
          const totalAmount = monthlyData.reduce((sum, m) => sum + m.total, 0);
          
          return {
            category,
            months: monthlyData,
            total: totalAmount
          };
        }).filter(item => item.total !== 0)
          .sort((a, b) => Math.abs(b.total) - Math.abs(a.total));
        
        return result;
      })
    );
  }

  getTransactionsByCategory(categoryId: string, year?: number, month?: number): Observable<Transaction[]> {
    let q = query(this.transactionsCollection, 
      where('categoryId', '==', categoryId),
      orderBy('date', 'desc')
    );

    if (year !== undefined && month !== undefined) {
      const startDate = new Date(year, month, 1, 0, 0, 0);
      const endDate = new Date(year, month + 1, 0, 23, 59, 59);
      
      q = query(
        this.transactionsCollection,
        where('categoryId', '==', categoryId),
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
