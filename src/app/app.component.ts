import { Component, inject, OnInit } from '@angular/core';
import { TableComponent } from './shared/table/table.component';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from './services/loading.service';
import { HttpReqService } from './services/http-req.service';
import { IStore } from './types';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-root',
  imports: [
    TableComponent,
    InputTextModule,
    CommonModule,
    FormsModule,
    ToastModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private loadingService = inject(LoadingService);
  private httpService = inject(HttpReqService);

  isLoading$ = this.loadingService.isLoading$;
  title = 'Reyon';

  stores: IStore[] = [];

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.stores = this.httpService.data();
  }

  search(event: any) {
    const filterValue = event.target.value;
    this.httpService.setSearchTerm(filterValue);
  }
}
