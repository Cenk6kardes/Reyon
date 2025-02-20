import { category } from './../../constants/index';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedImports } from '../sharedModule/shared-imports';
import { HttpReqService } from '../../services/http-req.service';
import { ToastService } from '../../services/toast.service';
import { IStore } from '../../types';
@Component({
  selector: 'add-rayon',
  imports: [SharedImports],
  templateUrl: './add-rayon.component.html',
  styleUrl: './add-rayon.component.css',
})
export class AddRayonComponent implements OnChanges {
  @Input() store!: IStore;
  @Input() rayonId!: number;
  @Output() hideModalEvent = new EventEmitter();

  private httpService = inject(HttpReqService);
  private toastService = inject(ToastService);
  category = category;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [{ value: '', disabled: true }],
      type: [null, Validators.required],
      store: [{ value: '', disabled: true }],
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

    this.httpService.addRayon(body, this.store.id);
    this.hideModalEvent.emit();
  }
}
