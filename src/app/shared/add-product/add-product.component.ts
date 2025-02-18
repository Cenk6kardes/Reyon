import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedImports } from '../sharedModule/shared-imports';
import { HttpReqService } from '../../services/http-req.service';
import { ToastService } from '../../services/toast.service';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'add-product',
  imports: [SharedImports],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnDestroy {
  @Output() hideModalEvent = new EventEmitter();

  private httpService = inject(HttpReqService);
  private toastService = inject(ToastService);
  private unsubscribe$ = new Subject<void>();

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
    this.ids = this.httpService.addProductData();
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
    this.httpService
      .createProduct(this.ids.storeId, body, this.ids.rayonId, this.ids.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.hideModalEvent.emit();
          this.toastService.show(
            'Başarılı',
            `${body.title}, R${this.ids.rayonId + 1} Reyonuna Eklendi.`,
            'success'
          );
        },
        error: (err) => {
          this.toastService.show('HATA!', 'Yeni Ürün Eklenemedi.', 'danger');
          console.log(err);
        },
      });
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
