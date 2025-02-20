import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TableComponent } from './shared/table/table.component';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from './services/loading.service';
import { HttpReqService } from './services/http-req.service';
import { IStore } from './types';
import { ToastModule } from 'primeng/toast';
import { CurrencyComponent } from './shared/currency/currency.component';
import { CurrencyService } from './services/currency.service';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-root',
  imports: [
    TableComponent,
    CurrencyComponent,
    InputTextModule,
    CommonModule,
    FormsModule,
    ToastModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  private loadingService = inject(LoadingService);
  private httpService = inject(HttpReqService);
  private currenciesService = inject(CurrencyService);
  private unsubscribe$ = new Subject<void>();
  isLoading$ = this.loadingService.isLoading$;
  title = 'Reyon';
  searchTerm = '';
  stores: IStore[] = [];

  currencies: any = [];

  ngOnInit(): void {
    this.getData();
    this.currencies = this.currenciesService
      .getExchangeRates()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.currencies = res.rates;
      });
  }

  getData() {
    this.stores = this.httpService.data();
  }

  search(event: any) {
    const filterValue = event.target.value;
    this.searchTerm = filterValue;
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
