import { Component, Input } from '@angular/core';
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
}
