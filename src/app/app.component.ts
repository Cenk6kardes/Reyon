import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TableComponent } from './shared/table/table.component';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from './services/loading.service';
import { HttpReqService } from './services/http-req.service';
import { IStore } from './types';
import { ToastModule } from 'primeng/toast';
import { ToastService } from './services/toast.service';
import { Observable, Subject } from 'rxjs';
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
export class AppComponent implements OnInit, OnDestroy {
  private loadingService = inject(LoadingService);
  private httpService = inject(HttpReqService);
  private toastService = inject(ToastService);
  private unsubscribe$ = new Subject<void>();

  isLoading$ = this.loadingService.isLoading$;
  title = 'Reyon';

  stores$!: Observable<IStore[]>;
  // stores: IStore[] = [];

  ngOnInit(): void {
    this.getData();
  }
  callAgain() {
    this.getData();
  }

  // getData() {
  //   this.httpService
  //     .getDatas()
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe({
  //       next: (res) => {
  //         this.stores = res;
  //       },
  //       error: (err) => {
  //         this.toastService.show(
  //           'HATA!',
  //           'Güncellenirken bir sorun oluştu',
  //           'danger'
  //         );
  //         console.log(err);
  //       },
  //     });
  // }

  getData() {
    this.stores$ = this.httpService.getDatas();
  }

  search(event: any) {
    const filterValue = event.target.value;
    this.httpService.setSearchTerm(filterValue);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
