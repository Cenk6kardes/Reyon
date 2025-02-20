import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedImports } from '../sharedModule/shared-imports';
import { HttpReqService } from '../../services/http-req.service';
import { category, getNextNumber } from '../../constants';
@Component({
  selector: 'edit-product',
  imports: [SharedImports],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css',
})
export class EditProductComponent implements OnInit {
  @Output() hideModalEvent = new EventEmitter();
  form: FormGroup;
  category = category;
  productInfo: {
    storeId: number;
    rayonId: number;
    id: number;
    rType: number;
    productId: string;
    productName: string;
  } = {
    storeId: -1,
    rayonId: -1,
    id: -1,
    rType: -1,
    productId: '',
    productName: '',
  };
  stores: Array<{ id: number; title: string }> = [];
  rayons: Array<{ label: string; value: number }> = [];
  newId = -1;
  constructor(private fb: FormBuilder, private httpService: HttpReqService) {
    this.form = this.fb.group({
      productId: [{ value: '', disabled: true }],
      title: [''],
      rType: [{ value: '', disabled: true }],
      moveStore: [null, Validators.required],
      moveRayon: [null, Validators.required],
    });

    this.stores = this.httpService
      .data()
      .map(({ id, title }) => ({ id, title }));
  }

  ngOnInit(): void {
    this.productInfo = this.httpService.productInfo();

    this.form.patchValue({
      productId: this.productInfo.productId,
      title: this.productInfo.productName,
      rType: this.productInfo.rType,
    });
  }

  storeSelectedCheckRayons(selectedStore: number) {
    this.rayons = this.httpService.checkRayons(
      selectedStore,
      this.productInfo.rType
    );
  }

  removeProduct() {
    this.httpService.removeProduct(
      this.productInfo.id,
      this.productInfo.storeId,
      this.productInfo.rayonId
    );
    this.hideModalEvent.emit();
  }

  rayonSelected() {
    const selectedRayon = this.httpService
      .data()
      .filter((store) => store.id === this.form.get('moveStore')?.value)
      .flatMap((store) =>
        store.rayon?.filter(
          (rayon) => rayon.id === this.form.get('moveRayon')?.value
        )
      );
    if (
      selectedRayon[0] &&
      selectedRayon[0].products &&
      selectedRayon[0].products.length > 0
    ) {
      this.newId = getNextNumber(selectedRayon[0].products);
    } else this.newId = -1;
  }

  submit() {
    const newProduct = {
      id: this.productInfo.id,
      productId: this.productInfo.productId,
      rayonId: this.form.get('moveRayon')?.value,
      title: this.form.get('title')?.value,
      rType: this.productInfo.rType,
    };
    this.httpService.removeProduct(
      this.productInfo.id,
      this.productInfo.storeId,
      this.productInfo.rayonId
    );
    this.httpService.addProduct(
      this.form.get('moveStore')?.value,
      this.form.get('moveRayon')?.value,
      newProduct
    );
    this.newId = -1;
    this.hideModalEvent.emit();
  }
}
