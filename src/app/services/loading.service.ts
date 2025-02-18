import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private isLoading = signal<boolean>(false);

  setLoading(value: boolean) {
    this.isLoading.set(value);
  }

  get isLoading$() {
    return this.isLoading.asReadonly();
  }
}
