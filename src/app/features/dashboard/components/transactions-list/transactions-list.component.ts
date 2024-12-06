import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DateAdapter } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs, 'es');

interface Transaction {
  id: string;
  category: string;
  amount: number;
  date: Date;
  type: 'income' | 'expense';
  description: string;
  icon: string;
  color: string;
}

interface TransactionGroup {
  date: Date;
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  expanded: boolean;
}

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TransactionsListComponent implements OnInit {
  displayedColumns: string[] = ['date', 'totalIncome', 'totalExpense'];
  transactions: Transaction[] = [
    { id: '1', category: 'Salario', amount: 2500, date: new Date('2024-03-05'), type: 'income', description: 'Salario mensual', icon: 'payments', color: '#4CAF50' },
    { id: '2', category: 'Comida', amount: -50, date: new Date('2024-03-05'), type: 'expense', description: 'Almuerzo', icon: 'restaurant', color: '#F44336' },
    { id: '3', category: 'Transporte', amount: -25, date: new Date('2024-03-05'), type: 'expense', description: 'Taxi', icon: 'directions_car', color: '#F44336' },
    { id: '4', category: 'Freelance', amount: 300, date: new Date('2024-03-04'), type: 'income', description: 'Proyecto web', icon: 'computer', color: '#4CAF50' },
  ];

  transactionGroups: TransactionGroup[] = [];

  monthlyTotals = {
    income: 0,
    expense: 0,
    balance: 0
  };

  constructor(public dialogRef: MatDialogRef<TransactionsListComponent>) {}

  ngOnInit() {
    this.groupTransactionsByDate();
    this.calculateMonthlyTotals();
  }

  groupTransactionsByDate() {
    const groups = new Map<string, Transaction[]>();
    
    this.transactions.forEach(transaction => {
      const dateStr = transaction.date.toDateString();
      if (!groups.has(dateStr)) {
        groups.set(dateStr, []);
      }
      groups.get(dateStr)?.push(transaction);
    });

    this.transactionGroups = Array.from(groups.entries()).map(([dateStr, transactions]) => ({
      date: new Date(dateStr),
      transactions: transactions,
      totalIncome: transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum, 0),
      totalExpense: transactions.reduce((sum, t) => t.type === 'expense' ? sum + Math.abs(t.amount) : sum, 0),
      expanded: false
    }));
  }

  calculateMonthlyTotals() {
    this.monthlyTotals.income = this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    this.monthlyTotals.expense = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    this.monthlyTotals.balance = this.monthlyTotals.income - this.monthlyTotals.expense;
  }

  toggleGroup(group: TransactionGroup) {
    group.expanded = !group.expanded;
  }

  close() {
    this.dialogRef.close();
  }
}
