export enum Category {
  Gıda,
  Temizlik,
  Kırtasiye,
  Kozmetik,
  Elektronik,
}

export const category = [
  { label: Category[0], value: Category.Gıda },
  { label: Category[1], value: Category.Temizlik },
  { label: Category[2], value: Category.Kırtasiye },
  { label: Category[3], value: Category.Kozmetik },
  { label: Category[4], value: Category.Elektronik },
];

export const Modals = {
  addRayon: 'Reyon Ekle',
  addProduct: 'Ürün Ekle',
  editProduct: 'Ürün Güncelle',
};

export function getNextNumber<T extends { id: number }>(items: T[]): number {
  if (items === undefined || items.length === 0) return 0;
  const sortedIds = items
    .filter((item) => item !== null && item !== undefined)
    .map((item) => item.id)
    .sort((a, b) => a - b);
  for (let i = 0; i < sortedIds.length; i++) {
    if (sortedIds[i] && sortedIds[i] !== i) {
      return i;
    }
  }
  return sortedIds.length;
}
