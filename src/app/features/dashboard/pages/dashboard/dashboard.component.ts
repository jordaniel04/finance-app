import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TransactionDialogComponent } from '../../components/transaction-dialog/transaction-dialog.component';
import { CategoriesListComponent } from '../../components/categories-list/categories-list.component';
import { TransactionsListComponent } from '../../components/transactions-list/transactions-list.component';
import { ReportDialogComponent } from '../../components/report-dialog/report-dialog.component';
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

  isDarkTheme = true;

  constructor(
    private readonly dialog: MatDialog, 
    private readonly authService: AuthService,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly router: Router
  ) {}

  ngOnInit() {
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

  // Método para cerrar todos los diálogos de forma segura
  private safelyCloseAllDialogs() {
    // Cerrar todos los diálogos usando el método de Angular
    this.dialog.closeAll();
    
    // Damos un pequeño tiempo para que Angular cierre los diálogos naturalmente
    // No eliminamos elementos del DOM manualmente para evitar interferencias
  }

  openTransactionDialog(transaction?: Transaction) {
    // Cerrar diálogos existentes de forma segura
    this.safelyCloseAllDialogs();

    // Esperar un breve momento para asegurar limpieza completa
    setTimeout(() => {
      const dialogRef = this.dialog.open(TransactionDialogComponent, {
        width: '400px',
        disableClose: true,
        data: { transaction },
        // Evitar conflictos con otros diálogos
        hasBackdrop: true,
        backdropClass: 'transaction-dialog-backdrop',
        panelClass: 'transaction-dialog-panel'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('Transaction:', result);
        }
      });
    }, 100);
  }

  openCategories() {
    this.safelyCloseAllDialogs();
    
    setTimeout(() => {
      this.dialog.open(CategoriesListComponent, {
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        panelClass: 'full-screen-dialog'
      });
    }, 100);
  }

  openAccounts() {
    // Implementar diálogo de cuentas
  }

  openTransactions() {
    this.safelyCloseAllDialogs();
    
    setTimeout(() => {
      this.dialog.open(TransactionsListComponent, {
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        panelClass: 'full-screen-dialog'
      });
    }, 100);
  }

  openReports() {
    // Cerrar diálogos existentes
    this.dialog.closeAll();

    setTimeout(() => {
      try {
        const dialogRef = this.dialog.open(ReportDialogComponent, {
          width: '100vw',
          height: '100vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          panelClass: ['full-screen-dialog', 'mat-dialog-no-padding'],
          position: {
            top: '0',
            left: '0'
          },
          disableClose: false,
          autoFocus: false,
          hasBackdrop: true
        });

        dialogRef.afterClosed().subscribe(() => {
          console.log('Diálogo de reportes cerrado');
        });
      } catch (error) {
        console.error('Error al abrir el diálogo de reportes:', error);
      }
    }, 100);
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
