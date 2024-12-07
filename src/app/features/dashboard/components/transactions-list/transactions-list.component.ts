import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TransactionsService } from '../../../../services/transactions.service';
import { Transaction, TransactionGroup } from '../../../../models/transaction';
import { AddTransactionDialogComponent } from '../add-transaction-dialog/add-transaction-dialog.component';
import { CategoriesService } from '../../../../services/categories.service';
import { map, switchMap } from 'rxjs/operators';

interface TransactionWithCategory extends Transaction {
  color: string;
  icon: string;
  category: string;
}

interface TransactionGroupWithCategory extends Omit<TransactionGroup, 'transactions'> {
  transactions: TransactionWithCategory[];
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
  transactions: TransactionWithCategory[] = [];
  transactionGroups: TransactionGroupWithCategory[] = [];
  monthlyTotals = {
    income: 0,
    expense: 0,
    balance: 0
  };

  constructor(
    public dialogRef: MatDialogRef<TransactionsListComponent>,
    private readonly dialog: MatDialog,
    private readonly transactionsService: TransactionsService,
    private readonly categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.transactionsService.getTransactions().pipe(
      switchMap(transactions => {
        return this.categoriesService.getCategories().pipe(
          map(categories => {
            return transactions.map(transaction => {
              const category = categories.find(c => c.id === transaction.categoryId);
              return {
                ...transaction,
                color: category?.color || '#000000',
                icon: category?.icon || 'attach_money',
                category: category?.name || 'Sin categoría'
              };
            });
          })
        );
      })
    ).subscribe(transactions => {
      this.transactions = transactions;
      this.groupTransactionsByDate();
      this.calculateMonthlyTotals();
    });
  }

  groupTransactionsByDate() {
    const groups = new Map<string, TransactionWithCategory[]>();
    
    this.transactions.forEach(transaction => {
      const dateStr = transaction.date.toDateString();
      if (!groups.has(dateStr)) {
        groups.set(dateStr, []);
      }
      groups.get(dateStr)?.push(transaction);
    });

    this.transactionGroups = Array.from(groups.entries()).map(([dateStr, transactions]) => ({
      date: new Date(dateStr),
      transactions,
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

  openAddTransactionDialog() {
    const dialogRef = this.dialog.open(AddTransactionDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.transactionsService.addTransaction(result);
      }
    });
  }
}
