import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryDetailReportComponent } from './category-detail-report.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CategoryDetailReportComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  exports: [
    CategoryDetailReportComponent
  ]
})
export class CategoryDetailReportModule { }
