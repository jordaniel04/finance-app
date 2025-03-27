import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Category } from '../../../../../models/category';
import { Transaction } from '../../../../../models/transaction';
import { TransactionsService } from '../../../../../services/transactions.service';

@Component({
  selector: 'app-category-detail-report',
  templateUrl: './category-detail-report.component.html',
  styleUrls: ['./category-detail-report.component.css']
})
export class CategoryDetailReportComponent implements OnInit, OnChanges {
  @Input() filterForm!: FormGroup;
  @Input() filterChanged: number = 0; // Contador que cambia cada vez que se actualiza el filtro
  
  loading = false;
  availableCategories: Category[] = [];
  
  // Datos del detalle de categoría
  categoryDetail: { 
    selectedCategory: Category | null,
    transactions: Transaction[]
  } = {
    selectedCategory: null,
    transactions: []
  };

  constructor(private transactionsService: TransactionsService) { }

  ngOnInit(): void {
    this.loadAvailableCategories();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // Si cambia el filtro o el contador de cambios
    if ((changes['filterForm'] && !changes['filterForm'].firstChange) || 
        (changes['filterChanged'] && !changes['filterChanged'].firstChange)) {
      // Guardar la categoría seleccionada actual
      const currentCategory = this.categoryDetail.selectedCategory;
      
      // Iniciar carga
      this.loading = true;
      
      // Recargar las categorías disponibles
      this.loadAvailableCategories().then(() => {
        // Si había una categoría seleccionada, intentar mantenerla
        if (currentCategory) {
          // Buscar la misma categoría en la nueva lista
          const updatedCategory = this.availableCategories.find(c => c.id === currentCategory.id);
          
          // Si la categoría todavía está disponible, cargar sus transacciones
          if (updatedCategory) {
            this.loadTransactionsByCategory(updatedCategory);
          } else {
            // Si ya no está disponible (no tiene transacciones en este mes), limpiar la selección
            this.clearCategorySelection();
            this.loading = false;
          }
        } else {
          this.loading = false;
        }
      });
    }
  }
  
  loadAvailableCategories(): Promise<void> {
    return new Promise<void>((resolve) => {
      const year = this.filterForm.get('year')?.value;
      const month = this.filterForm.get('month')?.value;
      
      this.transactionsService.getTransactionsByMonthAndCategory(year, month)
        .subscribe({
          next: (data) => {
            // Solo incluir categorías que tengan transacciones
            this.availableCategories = data
              .filter(item => item.transactions.length > 0)
              .map(item => item.category);
            
            resolve();
          },
          error: (error: any) => {
            console.error('Error al cargar categorías:', error);
            resolve();
          }
        });
    });
  }
  
  loadTransactionsByCategory(category: Category): void {
    this.loading = true;
    
    // Limpiar transacciones actuales antes de cargar nuevas
    this.categoryDetail.transactions = [];
    this.categoryDetail.selectedCategory = category;
    
    const year = this.filterForm.get('year')?.value;
    const month = this.filterForm.get('month')?.value;
    
    this.transactionsService.getTransactionsByCategory(category.id!, year, month)
      .subscribe({
        next: (transactions) => {
          // Pequeño retraso para asegurar que la UI se actualice correctamente
          setTimeout(() => {
            this.categoryDetail.transactions = transactions;
            this.loading = false;
          }, 100);
        },
        error: (error: any) => {
          console.error('Error al cargar transacciones por categoría:', error);
          this.loading = false;
        }
      });
  }
  
  clearCategorySelection(): void {
    this.categoryDetail.selectedCategory = null;
    this.categoryDetail.transactions = [];
  }
  
  calculateCategoryTotal(): number {
    if (!this.categoryDetail.transactions || this.categoryDetail.transactions.length === 0) {
      return 0;
    }
    
    return this.categoryDetail.transactions.reduce((total, transaction) => {
      const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;
      return total + amount;
    }, 0);
  }
  
  // Método auxiliar para formatear montos con separadores de miles
  formatAmount(amount: number): string {
    return amount.toLocaleString('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    });
  }
  
  // Método auxiliar para obtener el nombre del mes
  getMonthName(month: number): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month];
  }
}
