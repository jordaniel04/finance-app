import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TransactionsService } from '../../../../services/transactions.service';
import { Category } from '../../../../models/category';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Chart, ChartType } from 'chart.js';

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.css'],
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: '0', opacity: 0, overflow: 'hidden' }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden' }),
        animate('300ms ease-in', style({ height: '0', opacity: 0 }))
      ])
    ])
  ]
})
export class ReportDialogComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private incomeChart: Chart | null = null;
  private expenseChart: Chart | null = null;
  
  filterForm: FormGroup;
  loading = false;
  currentDate = new Date();
  
  // Contador para notificar cambios de filtro a componentes hijos
  filterChangeCounter = 0;
  
  // Datos para el gráfico
  categoryData: { category: Category, total: number, transactions: any[] }[] = [];
  monthlyData: any[] = [];
  monthlyIncomeData: any[] = [];
  monthlyExpenseData: any[] = [];
  
  // Datos separados por tipo
  incomeData: { category: Category, total: number, transactions: any[] }[] = [];
  expenseData: { category: Category, total: number, transactions: any[] }[] = [];
  
  // Meses
  months = [
    { value: 0, label: 'Enero' },
    { value: 1, label: 'Febrero' },
    { value: 2, label: 'Marzo' },
    { value: 3, label: 'Abril' },
    { value: 4, label: 'Mayo' },
    { value: 5, label: 'Junio' },
    { value: 6, label: 'Julio' },
    { value: 7, label: 'Agosto' },
    { value: 8, label: 'Septiembre' },
    { value: 9, label: 'Octubre' },
    { value: 10, label: 'Noviembre' },
    { value: 11, label: 'Diciembre' }
  ];
  
  constructor(
    private readonly dialogRef: MatDialogRef<ReportDialogComponent>,
    private readonly fb: FormBuilder,
    private readonly transactionsService: TransactionsService,
    private readonly zone: NgZone
  ) {
    // Inicializar el formulario con el mes y año actual
    this.filterForm = this.fb.group({
      year: [this.currentDate.getFullYear()],
      month: [this.currentDate.getMonth()]
    });

    // Configuración básica del diálogo
    this.dialogRef.disableClose = false;
    
    // Manejar eventos de cierre del diálogo
    this.dialogRef.backdropClick().pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.close();
    });
    
    this.dialogRef.keydownEvents().pipe(
      takeUntil(this.destroy$)
    ).subscribe(event => {
      if (event.key === 'Escape') {
        this.close();
      }
    });
  }
  
  ngOnInit() {
    // Cargar datos iniciales
    setTimeout(() => {
      this.loadReportData();
    }, 100);
  }
  
  loadReportData() {
    this.loading = true;
    
    // Limpiar gráficos anteriores
    this.destroyCharts();

    const year = this.filterForm.get('year')?.value;
    const month = this.filterForm.get('month')?.value;
    
    // Obtener los datos para el mes seleccionado
    this.transactionsService.getTransactionsByMonthAndCategory(year, month).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        // Procesar datos
        this.categoryData = data;
        this.incomeData = data.filter(item => item.total > 0);
        this.expenseData = data.filter(item => item.total < 0);

        // Desactivar indicador de carga
        this.loading = false;
        
        // Crear los gráficos con un retraso para asegurar que el DOM esté listo
        setTimeout(() => {
          this.createCharts();
        }, 250);
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this.loading = false;
      }
    });
      
    // Obtener datos para la vista acumulada
    this.loadMonthlyData(year, month);
  }
  
  loadMonthlyData(year: number, month: number) {
    // Calcular rango de 6 meses
    let endMonth = month;
    let endYear = year;
    let startMonth = month - 5;
    let startYear = year;
    
    if (startMonth < 0) {
      startMonth += 12;
      startYear--;
    }
    
    // Cargar datos acumulados
    this.transactionsService.getCategoryTotalsByMonthRange(startYear, startMonth, endYear, endMonth)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          // Procesar datos mensuales
          const allData = data.map(item => ({ ...item, expanded: false }));
          
          // Separar por tipo
          this.monthlyIncomeData = allData.filter(item => item.total > 0);
          this.monthlyExpenseData = allData.filter(item => item.total < 0);
          this.monthlyData = allData;
        },
        error: (error) => {
          console.error('Error al cargar datos mensuales:', error);
        }
      });
  }
  
  createCharts() {
    // Asegurarnos de que estamos en un contexto estable de la aplicación
    this.zone.run(() => {
      // Marcar esto como completado para evitar múltiples intentos
      console.log('Iniciando creación de gráficos...');
      
      // Primero asegurarse de que los gráficos anteriores están destruidos
      this.destroyCharts();
      
      // Luego, ejecutar el código de creación de gráficos fuera de la zona de Angular
      this.zone.runOutsideAngular(() => {
        // Retrasar la creación para asegurar que el DOM esté listo
        setTimeout(() => {
          try {
            this.createIncomeChart();
            this.createExpenseChart();
            console.log('Gráficos creados correctamente');
          } catch (error) {
            console.error('Error al crear los gráficos:', error);
          }
        }, 250);
      });
    });
  }

  createIncomeChart() {
    // Verificar que hay datos
    if (!this.incomeData.length) return;
    
    // Limpiar gráfico existente
    if (this.incomeChart) {
      this.incomeChart.destroy();
      this.incomeChart = null;
    }

    // Obtener el canvas
    const canvas = document.getElementById('incomeChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Preparar datos
    const sortedData = [...this.incomeData].sort((a, b) => b.total - a.total);
    const topCategories = sortedData.slice(0, 15);
    
    // Crear nuevo gráfico
    this.incomeChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: topCategories.map(item => item.category.name),
        datasets: [{
          label: 'Ingresos',
          data: topCategories.map(item => item.total),
          backgroundColor: topCategories.map(item => item.category.color || '#4caf50')
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 300
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            fontColor: 'white'
          }
        },
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true,
              fontColor: 'white'
            }
          }],
          yAxes: [{
            ticks: {
              fontColor: 'white'
            }
          }]
        }
      }
    });
  }
  
  createExpenseChart() {
    // Verificar que hay datos
    if (!this.expenseData.length) return;
    
    // Limpiar gráfico existente
    if (this.expenseChart) {
      this.expenseChart.destroy();
      this.expenseChart = null;
    }

    // Obtener el canvas
    const canvas = document.getElementById('expenseChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Preparar datos
    const sortedData = [...this.expenseData].sort((a, b) => Math.abs(b.total) - Math.abs(a.total));
    const topCategories = sortedData.slice(0, 15);
    
    // Crear nuevo gráfico
    this.expenseChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: topCategories.map(item => item.category.name),
        datasets: [{
          label: 'Gastos',
          data: topCategories.map(item => Math.abs(item.total)),
          backgroundColor: topCategories.map(item => item.category.color || '#f44336')
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 300
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            fontColor: 'white'
          }
        },
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true,
              fontColor: 'white'
            }
          }],
          yAxes: [{
            ticks: {
              fontColor: 'white'
            }
          }]
        }
      }
    });
  }
  
  onFilterChange() {
    // Actualizar datos al cambiar el filtro
    this.loading = true;
    this.filterChangeCounter++;
    this.loadReportData();
  }
  
  private destroyCharts() {
    // Limpiar gráficos
    if (this.incomeChart) {
      this.incomeChart.destroy();
      this.incomeChart = null;
    }
    
    if (this.expenseChart) {
      this.expenseChart.destroy();
      this.expenseChart = null;
    }
  }
  
  close() {
    // Limpiar recursos antes de cerrar
    this.destroyCharts();
    this.dialogRef.close();
  }

  // Método para obtener los años para el selector
  getYears(): number[] {
    const currentYear = new Date().getFullYear();
    return [currentYear - 2, currentYear - 1, currentYear];
  }
  
  // Método para formatear los montos
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
  }
  
  // Método para obtener el nombre del mes
  getMonthName(month: number): string {
    return this.months.find(m => m.value === month)?.label || '';
  }
  
  // Método para obtener el valor absoluto
  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }
  
  // Método para alternar la expansión de una categoría
  toggleCategoryExpanded(category: any) {
    category.expanded = !category.expanded;
  }
  
  ngOnDestroy() {
    // Limpiar recursos al destruir el componente
    this.destroyCharts();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
