import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { Transaction } from '../../../../models/transaction';
import { Category } from '../../../../models/category';
import { CategoriesService } from '../../../../services/categories.service';

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.component.html',
  styleUrls: ['./transaction-dialog.component.css']
})
export class TransactionDialogComponent implements OnInit {
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
    this.transactionForm.get('type')?.valueChanges.subscribe(type => {
      this.filterCategories(type);
      // Resetear la categoría seleccionada cuando cambie el tipo
      this.transactionForm.patchValue({ categoryId: '' });
    });
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe(categories => {
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
}
