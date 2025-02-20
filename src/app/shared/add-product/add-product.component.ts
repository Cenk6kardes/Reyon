import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedImports } from '../sharedModule/shared-imports';
import { HttpReqService } from '../../services/http-req.service';
@Component({
  selector: 'add-product',
  imports: [SharedImports],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent {
  @Output() hideModalEvent = new EventEmitter();

  private httpService = inject(HttpReqService);

  form: FormGroup;
  ids = { storeId: -1, rayonId: -1, id: -1, rType: -1 };
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      productId: [''],
      title: [''],
      rayon: [{ value: '', disabled: true }],
      Rtype: [-1],
    });
  }
  ngOnInit(): void {
    this.ids = this.httpService.productInfo();
    this.form.patchValue({
      rayon: `R${this.ids.rayonId + 1}`,
    });
  }

  onSubmit() {
    const body = {
      id: this.ids.id,
      productId: this.form.get('productId')?.value,
      rayonId: this.ids.rayonId,
      title: this.form.get('title')?.value,
      rType: this.ids.rType,
    };

    this.httpService.addProduct(this.ids.storeId, this.ids.rayonId, body);

    this.hideModalEvent.emit();
  }
}
