import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedImports } from '../sharedModule/shared-imports';
import { Category } from '../../constants';
import { HttpReqService } from '../../services/http-req.service';
import { ToastService } from '../../services/toast.service';
import { IStore } from '../../types';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'add-rayon',
  imports: [SharedImports],
  templateUrl: './add-rayon.component.html',
  styleUrl: './add-rayon.component.css',
})
export class AddRayonComponent implements OnChanges, OnDestroy {
  @Input() store!: IStore;
  @Input() rayonId!: number;
  @Output() hideModalEvent = new EventEmitter();

  private httpService = inject(HttpReqService);
  private toastService = inject(ToastService);
  private unsubscribe$ = new Subject<void>();

  form: FormGroup;
  category = [
    { label: Category[0], value: Category.Gıda },
    { label: Category[1], value: Category.Temizlik },
    { label: Category[2], value: Category.Kırtasiye },
    { label: Category[3], value: Category.Kozmetik },
    { label: Category[4], value: Category.Elektronik },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [{ value: '', disabled: true }], // reyon göster
      type: [null, Validators.required],
      store: [{ value: '', disabled: true }], // sadece Store göster
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['store'].currentValue && changes['store'].firstChange) {
      this.form.patchValue({
        id: `R${this.rayonId + 1}`,
        store: this.store.title,
      });
    }
  }

  submit() {
    const body = {
      type: this.form.get('type')?.value,
      id: this.rayonId,
      storeId: this.store.id,
    };
    this.httpService
      .createRayon(this.store.id, body, this.rayonId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.hideModalEvent.emit();
          this.toastService.show(
            'Başarılı',
            'Yeni Reyon Başarıyla Eklendi.',
            'success'
          );
        },
        error: (err) => {
          this.toastService.show('HATA!', 'Yeni Reyon Eklenemedi.', 'danger');
          console.log(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
