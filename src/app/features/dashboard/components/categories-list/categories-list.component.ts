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
  categories: Category[] = [];

  constructor(
    public dialogRef: MatDialogRef<CategoriesListComponent>,
    private dialog: MatDialog,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  addCategory() {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: { category: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoriesService.addCategory(result);
      }
    });
  }

  editCategory(category: Category) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: { category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && category.id) {
        this.categoriesService.updateCategory(category.id, result);
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
}