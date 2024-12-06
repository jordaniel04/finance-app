import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { Transaction } from '../../../../models/transaction';
import { Category } from '../../../../models/category';

@Component({
  selector: 'app-add-transaction-dialog',
  templateUrl: './add-transaction-dialog.component.html',
  styleUrls: ['./add-transaction-dialog.component.css']
})
export class AddTransactionDialogComponent implements OnInit {
  transactionForm: FormGroup;
  categories: Category[] = [
    { id: '1', name: 'Salario', type: 'income' },
    { id: '2', name: 'Freelance', type: 'income' },
    { id: '3', name: 'Alimentación', type: 'expense' },
    { id: '4', name: 'Transporte', type: 'expense' }
  ]; // Esto será reemplazado por datos reales de un servicio

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTransactionDialogComponent>,
    private dateAdapter: DateAdapter<any>
  ) {
    this.dateAdapter.setLocale('es');
    this.transactionForm = this.fb.group({
      type: ['income', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      date: [new Date(), Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.dateAdapter.setLocale('es');
    this.transactionForm.get('type')?.valueChanges.subscribe(type => {
      this.transactionForm.patchValue({ categoryId: '' });
    });
  }

  getFilteredCategories() {
    const type = this.transactionForm.get('type')?.value;
    return this.categories.filter(category => category.type === type);
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const transaction: Transaction = this.transactionForm.value;
      this.dialogRef.close(transaction);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
