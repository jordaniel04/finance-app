import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { Transaction } from '../../../../models/transaction';
import { Category } from '../../../../models/category';
import { CategoriesService } from '../../../../services/categories.service';

@Component({
  selector: 'app-add-transaction-dialog',
  templateUrl: './add-transaction-dialog.component.html',
  styleUrls: ['./add-transaction-dialog.component.css']
})
export class AddTransactionDialogComponent implements OnInit {
  transactionForm: FormGroup;
  categories: Category[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<AddTransactionDialogComponent>,
    private readonly dateAdapter: DateAdapter<any>,
    private readonly categoriesService: CategoriesService
  ) {
    this.dateAdapter.setLocale('es');
    this.transactionForm = this.fb.group({
      type: ['expense', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      date: [new Date(), Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.dateAdapter.setLocale('es');
    // this.transactionForm.get('type')?.valueChanges.subscribe(type => {
    //   this.transactionForm.patchValue({ categoryId: '' });
    // });
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
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
