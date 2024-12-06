import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTransactionDialogComponent } from '../../components/add-transaction-dialog/add-transaction-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  years: number[] = [];
  currentMonth: number;
  currentYear: number;
  totalBalance: number = 0;
  income: number = 0;
  expenses: number = 0;
  balance: number = 0;

  constructor(private dialog: MatDialog) {
    const now = new Date();
    this.currentMonth = now.getMonth();
    this.currentYear = now.getFullYear();
    
    // Generar años desde 2020 hasta el año actual + 5
    for (let year = 2020; year <= this.currentYear + 5; year++) {
      this.years.push(year);
    }
  }

  ngOnInit() {
    // Aquí puedes cargar los datos iniciales
    this.balance = 1000;
    this.income = 500;
    this.expenses = 300;
    this.totalBalance = this.income - this.expenses;
  }

  onMonthChange(event: any) {
    this.currentMonth = parseInt(event.target.value);
    this.loadData();
  }

  onYearChange(event: any) {
    this.currentYear = parseInt(event.target.value);
    this.loadData();
  }

  private loadData() {
    // Aquí implementarás la lógica para cargar los datos según el mes y año seleccionados
    console.log(`Cargando datos para ${this.months[this.currentMonth]} ${this.currentYear}`);
  }

  openAddTransactionDialog() {
    const dialogRef = this.dialog.open(AddTransactionDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Transaction added:', result);
        // Aquí implementaremos la lógica para guardar la transacción
      }
    });
  }
}
