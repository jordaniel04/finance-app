import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private firestore: Firestore) {}

  getCategories(): Observable<Category[]> {
    const categoriesRef = collection(this.firestore, 'categories');
    return collectionData(categoriesRef, { idField: 'id' }) as Observable<Category[]>;
  }

  addCategory(category: Omit<Category, 'id'>): Promise<any> {
    const categoriesRef = collection(this.firestore, 'categories');
    return addDoc(categoriesRef, category);
  }

  updateCategory(id: string, category: Partial<Category>): Promise<void> {
    const categoryDocRef = doc(this.firestore, `categories/${id}`);
    return updateDoc(categoryDocRef, category);
  }

  deleteCategory(id: string): Promise<void> {
    const categoryDocRef = doc(this.firestore, `categories/${id}`);
    return deleteDoc(categoryDocRef);
  }
}
