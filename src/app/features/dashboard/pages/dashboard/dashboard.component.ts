import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TransactionDialogComponent } from '../../components/transaction-dialog/transaction-dialog.component';
import { CategoriesListComponent } from '../../components/categories-list/categories-list.component';
import { TransactionsListComponent } from '../../components/transactions-list/transactions-list.component';
import { AuthService } from 'src/app/services/auth.service';
import { DOCUMENT } from '@angular/common';
import { Transaction } from 'src/app/models/transaction';
import { Router } from '@angular/router';

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
  isDarkTheme = true;

  constructor(
    private readonly dialog: MatDialog, 
    private readonly authService: AuthService,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly router: Router
  ) {}

  get totalExpenses(): number {
    return this.expensesData.reduce((acc, curr) => acc + curr.value, 0);
  }

  getExpensePercentage(value: number): number {
    return (value / this.totalExpenses) * 100;
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    // Recuperar el tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme');
    this.isDarkTheme = savedTheme ? savedTheme === 'dark' : true;
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDarkTheme) {
      this.document.body.classList.remove('light-theme');
      this.document.body.classList.add('dark-theme');
    } else {
      this.document.body.classList.remove('dark-theme');
      this.document.body.classList.add('light-theme');
    }
  }

  openTransactionDialog(transaction?: Transaction) {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '400px',
      disableClose: true,
      data: { transaction }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Transaction:', result);
      }
    });
  }

  openCategories() {
    this.dialog.open(CategoriesListComponent, {
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
    this.dialog.open(TransactionsListComponent, {
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

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Sesión cerrada exitosamente');
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    });
  }
}
