import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private apiUrl = 'https://api.exchangerate-api.com/v4/latest/TRY';
  constructor(private http: HttpClient) {}
  getExchangeRates() {
    return timer(0, 30000).pipe(switchMap(() => this.http.get(this.apiUrl)));
  }
}
