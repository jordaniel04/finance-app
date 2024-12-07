import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTransactionDialogComponent } from '../../components/add-transaction-dialog/add-transaction-dialog.component';
import { CategoriesListComponent } from '../../components/categories-list/categories-list.component';
import { TransactionsListComponent } from '../../components/transactions-list/transactions-list.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  accounts = [
    { name: 'Efectivo', balance: 750, type: 'cash' },
    { name: 'Banco', balance: 3469.50, type: 'bank' },
    { name: 'Ahorros', balance: 6220, type: 'savings' }
  ];

  expensesData = [
    { name: 'Alimentación', value: 300 },
    { name: 'Transporte', value: 150 },
    { name: 'Entretenimiento', value: 200 },
    { name: 'Servicios', value: 372.90 }
  ];

  user!: { firstName: string; lastName: string };

  constructor(private dialog: MatDialog, private authService: AuthService) {}

  get totalExpenses(): number {
    return this.expensesData.reduce((acc, curr) => acc + curr.value, 0);
  }

  getExpensePercentage(value: number): number {
    return (value / this.totalExpenses) * 100;
  }

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  openAddTransactionDialog() {
    const dialogRef = this.dialog.open(AddTransactionDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Transaction added:', result);
      }
    });
  }

  openCategories() {
    const dialogRef = this.dialog.open(CategoriesListComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      panelClass: 'full-screen-dialog'
    });
  }

  openAccounts() {
    // Implementar diálogo de cuentas
  }

  openTransactions() {
    const dialogRef = this.dialog.open(TransactionsListComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      panelClass: 'full-screen-dialog'
    });
  }

  openReports() {
    // Implementar diálogo de reportes
  }

  addAccount() {
    // Implementar diálogo para agregar cuenta
  }
}
