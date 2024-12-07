import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from '../../../../models/category';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.css']
})
export class CategoryDialogComponent {
  iconList: string[] = [
    'shopping_cart', 'restaurant', 'local_taxi', 'movie',
    'fitness_center', 'school', 'local_hospital', 'home',
    'work', 'attach_money', 'account_balance', 'credit_card',
    'local_grocery_store', 'directions_car', 'flight', 'hotel'
  ];

  categoryForm: FormGroup;
  isEditing: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { category?: Category }
  ) {
    this.isEditing = !!data.category;
    this.categoryForm = this.fb.group({
      name: [data.category?.name || '', Validators.required],
      icon: [data.category?.icon || '', Validators.required],
      color: [data.category?.color || '#000000', Validators.required],
      type: [data.category?.type || 'expense', Validators.required]
    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      this.dialogRef.close(this.categoryForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onIconSelect(event: any) {
    const selectedIcon = event.value;
    this.dialogRef.close({ ...this.categoryForm.value, icon: selectedIcon });
  }
}
