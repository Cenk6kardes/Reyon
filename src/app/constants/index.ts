export enum Category {
  Gıda,
  Temizlik,
  Kırtasiye,
  Kozmetik,
  Elektronik,
}

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
