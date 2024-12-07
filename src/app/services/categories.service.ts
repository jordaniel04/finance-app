import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private readonly firestore: Firestore, private readonly authService: AuthService) {}

  getCategories(): Observable<Category[]> {
    const categoriesRef = collection(this.firestore, 'categories');
    return collectionData(categoriesRef, { idField: 'id' }) as Observable<Category[]>;
  }

  async addCategory(category: Omit<Category, 'id'>): Promise<any> {
    const categoriesRef = collection(this.firestore, 'categories');
    const user = this.authService.getUser();
    const categoryWithAudit = {
      ...category,
      createdBy: user.firstName + ' ' + user.lastName,
      createdAt: new Date()
    };
    return addDoc(categoriesRef, categoryWithAudit);
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<void> {
    const categoryDocRef = doc(this.firestore, `categories/${id}`);
    const user = this.authService.getUser();
    const categoryWithAudit = {
      ...category,
      updatedBy: user.firstName + ' ' + user.lastName,
      updatedAt: new Date()
    };
    return updateDoc(categoryDocRef, categoryWithAudit);
  }

  deleteCategory(id: string): Promise<void> {
    const categoryDocRef = doc(this.firestore, `categories/${id}`);
    return deleteDoc(categoryDocRef);
  }
}
