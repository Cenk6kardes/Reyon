import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-currency',
  imports: [],
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.css',
})
export class CurrencyComponent {
  @Input() rate!: string;
  @Input() icon!: string;
}
