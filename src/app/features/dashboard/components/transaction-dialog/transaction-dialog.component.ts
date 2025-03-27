import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { Transaction } from '../../../../models/transaction';
import { Category } from '../../../../models/category';
import { CategoriesService } from '../../../../services/categories.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.component.html',
  styleUrls: ['./transaction-dialog.component.css']
})
export class TransactionDialogComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  transactionForm: FormGroup;
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  isEditing: boolean;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<TransactionDialogComponent>,
    private readonly dateAdapter: DateAdapter<any>,
    private readonly categoriesService: CategoriesService,
    @Inject(MAT_DIALOG_DATA) public data?: { transaction?: Transaction }
  ) {
    this.dateAdapter.setLocale('es');
    
    // Configurar el diálogo para que sea responsive
    this.dialogRef.updatePosition({
        top: '20px'
    });
    
    this.dialogRef.updateSize('90vw', 'auto');
    
    this.isEditing = !!data?.transaction;
    
    this.transactionForm = this.fb.group({
        type: [data?.transaction?.type ?? 'expense', Validators.required],
        amount: [data?.transaction?.amount ?? '', [Validators.required, Validators.min(0)]],
        description: [data?.transaction?.description ?? '', Validators.required],
        date: [data?.transaction?.date ? new Date(data.transaction.date) : new Date(), Validators.required],
        categoryId: [data?.transaction?.categoryId ?? '', Validators.required]
    });

    if (this.isEditing) {
        this.loadCategories();
    }
  }

  ngOnInit() {
    this.loadCategories();
    this.dateAdapter.setLocale('es');
    
    // Suscribirse a los cambios del tipo de transacción
    this.transactionForm.get('type')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => {
        this.filterCategories(type);
        // Resetear la categoría seleccionada cuando cambie el tipo
        this.transactionForm.patchValue({ categoryId: '' });
      });
  }

  loadCategories() {
    this.categoriesService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => {
        this.categories = categories;
        // Filtrar categorías iniciales basadas en el tipo inicial (expense)
        this.filterCategories(this.transactionForm.get('type')?.value);
      });
  }

  filterCategories(type: 'income' | 'expense') {
    this.filteredCategories = this.categories.filter(category => category.type === type);
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      const selectedDate = formValue.date;
      
      // Aseguramos que la fecha mantiene la hora actual si es hoy
      const now = new Date();
      if (selectedDate.toDateString() === now.toDateString()) {
        selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
      } else {
        // Si es otra fecha, establecemos una hora predeterminada (12:00)
        selectedDate.setHours(12, 0, 0);
      }

      const transaction: Transaction = {
        ...formValue,
        date: selectedDate
      };
      this.dialogRef.close(transaction);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  deleteTransaction() {
    if (confirm('¿Está seguro de eliminar esta transacción?')) {
      this.dialogRef.close({ delete: true, transactionId: this.data?.transaction?.id });
    }
  }

  /**
   * Obtiene la categoría seleccionada actualmente en el formulario
   */
  getSelectedCategory(): Category | undefined {
    const selectedCategoryId = this.transactionForm.get('categoryId')?.value;
    return this.categories.find(category => category.id === selectedCategoryId);
  }
  
  ngOnDestroy() {
    // Limpiar todas las suscripciones
    this.destroy$.next();
    this.destroy$.complete();
  }
}
