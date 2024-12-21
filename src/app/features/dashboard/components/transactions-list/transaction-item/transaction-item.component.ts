import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from '../../../../../models/transaction';

interface TransactionWithCategory extends Transaction {
  categoryColor: string;
  categoryIcon: string;
  categoryName: string;
}

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.css']
})
export class TransactionItemComponent {
  @Input() transaction!: TransactionWithCategory;
  @Output() edit = new EventEmitter<TransactionWithCategory>();
  @Output() delete = new EventEmitter<TransactionWithCategory>();

  onEdit() {
    this.edit.emit(this.transaction);
  }

  onDelete() {
    if (confirm('¿Está seguro de eliminar esta transacción?')) {
      this.delete.emit(this.transaction);
    }
  }
}
