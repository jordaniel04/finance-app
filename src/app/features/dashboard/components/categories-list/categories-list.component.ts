import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../../../../models/category';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent {
  categories: Category[] = [
    { id: '1', name: 'Artículos de aseo', icon: 'cleaning_services', color: '#FF9800', type: 'expense' },
    { id: '2', name: 'Aseo personal', icon: 'spa', color: '#2196F3', type: 'expense' },
    { id: '3', name: 'Bebidas', icon: 'local_bar', color: '#4CAF50', type: 'expense' },
    { id: '4', name: 'Bicicleta', icon: 'pedal_bike', color: '#9C27B0', type: 'expense' },
    { id: '5', name: 'Casa', icon: 'home', color: '#F44336', type: 'expense' },
    { id: '6', name: 'Comestibles', icon: 'shopping_basket', color: '#3F51B5', type: 'expense' },
    { id: '7', name: 'Comida', icon: 'restaurant', color: '#009688', type: 'expense' },
    { id: '8', name: 'Educación', icon: 'school', color: '#795548', type: 'expense' },
    { id: '9', name: 'Entretenimiento', icon: 'sports_esports', color: '#607D8B', type: 'expense' }
  ];

  constructor(
    public dialogRef: MatDialogRef<CategoriesListComponent>,
    private dialog: MatDialog
  ) {}

  addCategory() {
    // Implementar diálogo para agregar categoría
  }

  close() {
    this.dialogRef.close();
  }
}