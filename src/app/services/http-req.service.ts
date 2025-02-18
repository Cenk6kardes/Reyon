import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  Observable,
} from 'rxjs';
import { IProduct, IRayon, IStore } from '../types';

@Injectable({
  providedIn: 'root',
})
export class HttpReqService {
  constructor(private http: HttpClient) {}
  addProductData = signal<{
    storeId: number;
    rayonId: number;
    id: number;
    rType: number;
  }>({
    storeId: -1,
    rayonId: -1,
    id: -1,
    rType: -1,
  });

  editProductData = signal<any>({
    rType: -1,
    title: '',
    productId: '',
  });

  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject
    .asObservable()
    .pipe(debounceTime(500), distinctUntilChanged());

  setSearchTerm(term: string) {
    this.searchSubject.next(term);
  }

  updateAddProductData(product: {
    storeId: number;
    rayonId: number;
    rType: number;
    id: number;
  }) {
    this.addProductData.set(product);
  }

  updateEditProductData(product: any) {
    this.editProductData.set(product);
  }

  getDatas(): Observable<IStore[]> {
    return this.http.get<IStore[]>(
      'https://reyon-d43cc-default-rtdb.europe-west1.firebasedatabase.app/stores.json'
    );
  }

  createRayon(storeId: number, body: IRayon, title: number) {
    return this.http.put(
      `https://reyon-d43cc-default-rtdb.europe-west1.firebasedatabase.app/stores/${storeId}/rayon/${title}.json`,
      body
    );
  }

  deleteRayon(storeId: number, rayonId: number) {
    return this.http.delete(
      `https://reyon-d43cc-default-rtdb.europe-west1.firebasedatabase.app/stores/${storeId}/rayon/${rayonId}.json`
    );
  }

  createProduct(storeId: number, body: IProduct, rayonId: number, id: number) {
    return this.http.put(
      `https://reyon-d43cc-default-rtdb.europe-west1.firebasedatabase.app/stores/${storeId}/rayon/${rayonId}/products/${id}.json`,
      body
    );
  }
}
