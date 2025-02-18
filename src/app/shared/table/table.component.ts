import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { Column, IProduct, IRayon, IStore } from '../../types';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { Category, Modals } from '../../constants';
import { DialogModule } from 'primeng/dialog';
import { AddProductComponent } from '../add-product/add-product.component';
import { AddRayonComponent } from '../add-rayon/add-rayon.component';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from '../../services/toast.service';
import { Subject, takeUntil } from 'rxjs';
import { HttpReqService } from '../../services/http-req.service';
import { getNextNumber } from '../../constants';

@Component({
  selector: 'table',
  imports: [
    TableModule,
    CommonModule,
    PanelModule,
    ButtonModule,
    DialogModule,
    ConfirmPopupModule,
    AddProductComponent,
    AddRayonComponent,
    EditProductComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() store!: IStore;
  @ViewChild('dt') dt!: Table;
  @ViewChild(AddProductComponent) addProductComponent!: AddProductComponent;
  @Output() restoreDataEvent = new EventEmitter<boolean>();

  private unsubscribe$ = new Subject<void>();

  private confirmationService = inject(ConfirmationService);
  private toastService = inject(ToastService);
  private httpService = inject(HttpReqService);
  productTypes = Category;
  modals = Modals;
  head = '';
  rayon: IRayon[] = [];

  newRayonId = -1;

  modalVisible = false;
  modalHeader = '';

  ngOnInit(): void {
    this.httpService.search$.subscribe((res) => {
      this.dt.filterGlobal(res, 'contains');
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['store'] && changes['store'].currentValue.rayon) {
      this.rayon = changes['store'].currentValue.rayon;
    }
    this.head = `${changes['store'].currentValue.title}`;
  }

  columns: Column[] = [
    { field: 'id', header: 'Reyon' },
    { field: 'type', header: 'Tür' },
    { field: 'products', header: 'Ürünler' },
  ];

  openAddRayonModal() {
    this.modalHeader = this.modals.addRayon;
    this.modalVisible = true;

    this.newRayonId = getNextNumber(this.store.rayon!);
  }

  deleteRayon(event: Event, rayonId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `R${
        rayonId + 1
      } reyonunu içindekilerle silmek istediğinize emin misiniz ? `,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'İptal',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Evet',
      },
      accept: () => {
        this.httpService
          .deleteRayon(this.store.id, rayonId)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: () => {
              this.hideModal(true);
              this.toastService.show(
                'Başarılı',
                `R${rayonId + 1} Başarıyla Silindi`,
                'success'
              );
            },
            error: (err) => {
              this.toastService.show(
                'HATA!',
                `R${rayonId + 1} Silme işlemi Başarısız.`,
                'danger'
              );
              console.log(err);
            },
          });
      },
    });
  }

  openAddProductModal(rayon: IRayon) {
    this.modalHeader = this.modals.addProduct;
    this.modalVisible = true;
    const id = getNextNumber(rayon.products!);
    this.httpService.updateAddProductData({
      storeId: rayon.storeId,
      rayonId: rayon.id,
      rType: rayon.type,
      id,
    });
  }

  openEditProductModal(product: IProduct) {
    this.modalHeader = this.modals.editProduct;
    this.modalVisible = true;
    this.httpService.updateEditProductData({
      rType: product.rType,
      title: product.title,
      productId: product.productId,
    });
  }

  hideModal(withChanges: boolean) {
    if (withChanges) {
      this.restoreDataEvent.emit(true);
    }
    this.modalVisible = false;
    this.modalHeader = '';
    this.newRayonId = -1;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
