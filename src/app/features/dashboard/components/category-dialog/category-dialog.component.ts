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
}
