import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
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
import { Subject } from 'rxjs';
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
export class TableComponent implements OnChanges {
  @Input() store!: IStore;
  @Input() search!: string;
  @ViewChild('dt') dt!: Table;
  @ViewChild(AddProductComponent) addProductComponent!: AddProductComponent;
  @Output() restoreDataEvent = new EventEmitter<boolean>();

  private unsubscribe$ = new Subject<void>();

  private confirmationService = inject(ConfirmationService);
  private httpService = inject(HttpReqService);
  productTypes = Category;
  modals = Modals;
  head = '';
  rayon: IRayon[] = [];
  filteredRayon: IRayon[] = [];

  newRayonId = -1;

  modalVisible = false;
  modalHeader = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['store'] && changes['store'].currentValue.rayon) {
      this.rayon = changes['store'].currentValue.rayon;
      this.head = `${changes['store'].currentValue.title}`;
    }

    if (changes['search']) {
      const trimmedSearch = changes['search'].currentValue.trim().toLowerCase();
      if (trimmedSearch) {
        this.filteredRayon = this.rayon
          .map((reyon) => ({
            ...reyon,
            products:
              reyon.products?.filter((product) =>
                product.title.toLowerCase().includes(trimmedSearch)
              ) ?? [],
          }))
          .filter((reyon) => reyon.products.length > 0);
      } else {
        this.filteredRayon = [...this.rayon];
      }
    }
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
        this.httpService.removeRayon(rayonId, this.store.id);

        this.hideModal(true);
      },
    });
  }

  openAddProductModal(rayon: IRayon) {
    this.modalHeader = this.modals.addProduct;
    this.modalVisible = true;
    const id = getNextNumber(rayon.products!);
    this.httpService.updateProductInfo({
      storeId: rayon.storeId,
      rayonId: rayon.id,
      rType: rayon.type,
      id,
      productId: '',
      productName: '',
    });
  }

  openEditProductModal(product: IProduct) {
    this.modalHeader = this.modals.editProduct;
    this.modalVisible = true;
    this.httpService.updateProductInfo({
      storeId: this.store.id,
      rayonId: product.rayonId,
      rType: product.rType,
      id: product.id,
      productId: product.productId,
      productName: product.title,
    });
  }

  hideModal(withChanges: boolean) {
    if (withChanges) {
      this.restoreDataEvent.emit(true);
    }
    this.modalVisible = false;
    this.modalHeader = '';
    this.newRayonId = -1;
    this.httpService.updateProductInfo({
      storeId: -1,
      rayonId: -1,
      rType: -1,
      id: -1,
      productId: '',
      productName: '',
    });
  }
}
