import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../../../../models/category';
import { CategoriesService } from '../../../../services/categories.service';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {
  incomeCategories: Category[] = [];
  expenseCategories: Category[] = [];

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly dialog: MatDialog,
    public dialogRef: MatDialogRef<CategoriesListComponent>
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe(categories => {
      this.incomeCategories = categories.filter(cat => cat.type === 'income');
      this.expenseCategories = categories.filter(cat => cat.type === 'expense');
    });
  }

  addCategory() {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: { category: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.delete) {
          this.categoriesService.deleteCategory(result.categoryId);
        } else {
          this.categoriesService.addCategory(result);
        }
      }
    });
  }

  editCategory(category: Category) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: { category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.delete) {
          this.categoriesService.deleteCategory(result.categoryId);
        } else if (category.id) {
          this.categoriesService.updateCategory(category.id, result);
        }
      }
    });
  }

  deleteCategory(id: string) {
    if (confirm('¿Está seguro de eliminar esta categoría?')) {
      this.categoriesService.deleteCategory(id);
    }
  }

  close() {
    this.dialogRef.close();
  }

  handleKeyDown(event: KeyboardEvent) {
    event.stopPropagation();
    return false;
  }
}