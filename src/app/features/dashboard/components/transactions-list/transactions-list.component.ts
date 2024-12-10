import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TransactionsService } from '../../../../services/transactions.service';
import { Transaction, TransactionGroup } from '../../../../models/transaction';
import { AddTransactionDialogComponent } from '../add-transaction-dialog/add-transaction-dialog.component';
import { CategoriesService } from '../../../../services/categories.service';
import { map, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';

interface TransactionWithCategory extends Transaction {
  categoryColor: string;
  categoryIcon: string;
  categoryName: string;
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

  selectedDate = new FormControl(new Date());

  @ViewChild('picker') picker!: MatDatepicker<any>;

  constructor(
    public dialogRef: MatDialogRef<TransactionsListComponent>,
    private readonly dialog: MatDialog,
    private readonly transactionsService: TransactionsService,
    private readonly categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.loadTransactions();
    
    this.selectedDate.valueChanges.subscribe(() => {
      this.loadTransactions();
    });
  }

  monthSelected(date: Date) {
    this.selectedDate.setValue(date);
    this.picker.close();
    this.loadTransactions();
  }

  loadTransactions() {
    const date = this.selectedDate.value;
    if (!date) return;
    
    const year = date.getFullYear();
    const month = date.getMonth();

    this.transactionsService.getTransactions(year, month).pipe(
      switchMap(transactions => {
        return this.categoriesService.getCategories().pipe(
          map(categories => {
            const transactionsWithCategory = transactions.map(transaction => {
              const category = categories.find(c => c.id === transaction.categoryId);
              return {
                ...transaction,
                categoryName: category?.name || 'Sin categoría',
                categoryIcon: category?.icon || 'attach_money',
                categoryColor: category?.color || '#000000'
              };
            });

            const groups = transactionsWithCategory.reduce((acc, curr) => {
              const date = curr.date;
              const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
              
              if (!acc[dateKey]) {
                acc[dateKey] = {
                  date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                  transactions: [],
                  totalIncome: 0,
                  totalExpense: 0,
                  expanded: false
                };
              }
              acc[dateKey].transactions.push(curr);
              if (curr.type === 'income') {
                acc[dateKey].totalIncome += curr.amount;
              } else {
                acc[dateKey].totalExpense += curr.amount;
              }
              return acc;
            }, {} as Record<string, any>);

            this.transactionGroups = Object.values(groups).sort((a, b) => 
              b.date.getTime() - a.date.getTime()
            );

            this.monthlyTotals = {
              income: this.transactionGroups.reduce((sum, group) => sum + group.totalIncome, 0),
              expense: this.transactionGroups.reduce((sum, group) => sum + group.totalExpense, 0),
              balance: 0
            };
            this.monthlyTotals.balance = this.monthlyTotals.income - this.monthlyTotals.expense;
          })
        );
      })
    ).subscribe();
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
      disableClose: true,
      position: { top: '20px' },
      panelClass: 'transaction-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.transactionsService.addTransaction(result);
      }
    });
  }
}
