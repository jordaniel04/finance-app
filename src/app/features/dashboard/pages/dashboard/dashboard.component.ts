import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTransactionDialogComponent } from '../../components/add-transaction-dialog/add-transaction-dialog.component';

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

  constructor(private dialog: MatDialog) {}

  get totalExpenses(): number {
    return this.expensesData.reduce((acc, curr) => acc + curr.value, 0);
  }

  getExpensePercentage(value: number): number {
    return (value / this.totalExpenses) * 100;
  }

  ngOnInit() {}

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
    // Implementar diálogo de categorías
  }

  openAccounts() {
    // Implementar diálogo de cuentas
  }

  openTransactions() {
    // Implementar vista de transacciones
  }

  addAccount() {
    // Implementar diálogo para agregar cuenta
  }
}
