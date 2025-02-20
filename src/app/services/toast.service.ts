import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageService = inject(MessageService);

  show(summary: string, detail: string, color: string) {
    this.messageService.add({ severity: color, summary, detail });
  }
}
