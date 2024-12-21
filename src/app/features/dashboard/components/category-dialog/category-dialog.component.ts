import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from '../../../../models/category';
import { ALL_ICONS, MATERIAL_ICONS, CATEGORY_COLORS } from '../../../../core/constants/icons.constants';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.css']
})
export class CategoryDialogComponent {
  iconList = ALL_ICONS;
  iconsByCategory = MATERIAL_ICONS;
  categoryColors = CATEGORY_COLORS;

  categoryForm: FormGroup;
  isEditing: boolean;

  constructor(
    private readonly fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { category?: Category }
  ) {
    this.isEditing = !!data.category;
    this.categoryForm = this.fb.group({
      name: [data.category?.name ?? '', Validators.required],
      icon: [data.category?.icon ?? ALL_ICONS[0], Validators.required],
      color: [data.category?.color ?? CATEGORY_COLORS.EXPENSE[0], Validators.required],
      type: [data.category?.type ?? 'expense', Validators.required]
    });

    this.categoryForm.get('type')?.valueChanges.subscribe(type => {
      if (!this.isEditing) {
        const defaultColor = type === 'income' ? 
          CATEGORY_COLORS.INCOME[0] : 
          CATEGORY_COLORS.EXPENSE[0];
        this.categoryForm.patchValue({ color: defaultColor });
      }
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
    this.categoryForm.patchValue({ icon: selectedIcon });
  }

  deleteCategory() {
    if (confirm('¿Está seguro de eliminar esta categoría?')) {
      this.dialogRef.close({ delete: true, categoryId: this.data.category?.id });
    }
  }
}
