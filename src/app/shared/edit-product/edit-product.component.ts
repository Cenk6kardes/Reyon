import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedImports } from '../sharedModule/shared-imports';
import { HttpReqService } from '../../services/http-req.service';
@Component({
  selector: 'edit-product',
  imports: [SharedImports],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css',
})
export class EditProductComponent implements OnInit {
  form: FormGroup;
  editIds: any;
  constructor(private fb: FormBuilder, private httpService: HttpReqService) {
    this.form = this.fb.group({
      productId: [{ value: '', disabled: true }],
      title: [''],
      rType: [{ value: '', disabled: true }],
      moveStore: [''],
      moveRayon: [''],
    });
  }
  ngOnInit(): void {
    this.editIds = this.httpService.addProductData();
    console.log(this.editIds);
    this.form.patchValue({
      rType: this.editIds.rType,
      productId: this.editIds.productId,
      title: this.editIds.title,
    });
  }

  submit() {}
}
