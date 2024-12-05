import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentDate = new Date();
  totalBalance = 2000.00;
  income = 0.00;
  expenses = 0.00;
  balance = 0.00;

  ngOnInit() {
    // Aquí irá la lógica para cargar los datos
  }

  onDateChange(event: any) {
    // Aquí irá la lógica para actualizar los datos según la fecha
    console.log('Fecha seleccionada:', event);
  }
}
