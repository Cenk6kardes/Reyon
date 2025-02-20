import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { IProduct, IRayon, IStore } from '../types';

@Injectable({
  providedIn: 'root',
})
export class HttpReqService {
  constructor() {}

  data = signal<IStore[]>([
    {
      id: 0,
      title: 'Depo A',
      rayon: [
        {
          id: 0,
          type: 2,
          storeId: 0,
          products: [
            {
              id: 0,
              productId: '123123',
              rayonId: 0,
              title: 'Makarna',
              rType: 2,
            },
          ],
        },
      ],
    },
    {
      id: 1,
      title: 'Depo B',
      rayon: [
        {
          id: 0,
          type: 1,
          storeId: 1,
          products: [
            {
              id: 0,
              productId: '44A',
              rayonId: 0,
              title: 'Bez',
              rType: 1,
            },
          ],
        },
      ],
    },
  ]);

  productInfo = signal<{
    storeId: number;
    rayonId: number;
    id: number;
    rType: number;
    productId: string;
    productName: string;
  }>({
    storeId: -1,
    rayonId: -1,
    id: -1,
    rType: -1,
    productId: '',
    productName: '',
  });

  updateProductInfo(product: {
    storeId: number;
    rayonId: number;
    rType: number;
    id: number;
    productId: string;
    productName: string;
  }) {
    this.productInfo.set(product);
  }

  setData(newData: IStore[]) {
    this.data.set(newData);
  }

  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject
    .asObservable()
    .pipe(debounceTime(500), distinctUntilChanged());

  setSearchTerm(term: string) {
    this.searchSubject.next(term);
  }

  addRayon(rayon: IRayon, storeId: number) {
    this.data.update((stores) =>
      stores.map((store) =>
        store.id === storeId
          ? {
              ...store,
              rayon: [...(store.rayon ?? []), rayon].sort(
                (a, b) => a.id - b.id
              ),
            }
          : store
      )
    );
  }

  removeRayon(rayonId: number, storeId: number) {
    this.data.update((stores) =>
      stores.map((store) =>
        store.id === storeId
          ? {
              ...store,
              rayon: store.rayon?.filter((rayon) => rayon.id !== rayonId) ?? [],
            }
          : store
      )
    );
  }

  addProduct(storeId: number, rayonId: number, newProduct: IProduct) {
    this.data.update((stores) =>
      stores.map((store) =>
        store.id === storeId
          ? {
              ...store,
              rayon: (store.rayon ?? []).map((rayon) =>
                rayon.id === rayonId
                  ? {
                      ...rayon,
                      products: [...(rayon.products ?? []), newProduct].sort(
                        (a, b) => a.id - b.id
                      ),
                    }
                  : rayon
              ),
            }
          : store
      )
    );
  }

  removeProduct(id: number, storeId: number, rayonId: number) {
    this.data.update((stores) =>
      stores.map((store) =>
        store.id === storeId
          ? {
              ...store,
              rayon: store.rayon?.map((rayon) =>
                rayon.id === rayonId
                  ? {
                      ...rayon,
                      products: (rayon.products ?? []).filter(
                        (product) => product.id !== id
                      ),
                    }
                  : rayon
              ),
            }
          : store
      )
    );
  }

  checkRayons(storeId: number, rayonType: number) {
    return this.data()
      .filter((store) => store.id === storeId)
      .flatMap(
        (store) =>
          store.rayon?.filter((rayon) => rayon.type === rayonType) ?? []
      )
      .map(({ id }) => ({ label: `R${id + 1}`, value: id }));
  }
}
