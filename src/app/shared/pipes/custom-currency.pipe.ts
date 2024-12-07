import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number, symbol: string = 'S/.', decimalLength: number = 2): string {
    const formattedValue = value.toFixed(decimalLength).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return `${symbol} ${formattedValue}`;
  }
}
