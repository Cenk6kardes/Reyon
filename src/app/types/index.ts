export type IStore = {
  id: number;
  title: string;
  rayon?: IRayon[];
};

export type IRayon = {
  id: number;
  type: number;
  storeId: number;
  products?: IProduct[];
};

export type IProduct = {
  id: number;
  productId: string;
  rayonId: number;
  title: string;
  rType: number;
};

export interface Column {
  field: string;
  header: string;
}
