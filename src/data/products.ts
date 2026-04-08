export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  cat: string;
  inStock: boolean;
  rec: boolean;
}

export const products: Product[] = [
  { id: 1, name: 'Produkt Alpha Premium', sku: 'PA-001', price: 45.5, cat: 'Kategori 1', inStock: true, rec: true },
  { id: 2, name: 'Produkt Beta Standard', sku: 'PB-002', price: 32.0, cat: 'Kategori 1', inStock: true, rec: false },
  { id: 3, name: 'Produkt Gamma Deluxe', sku: 'PC-003', price: 67.0, cat: 'Kategori 2', inStock: true, rec: true },
  { id: 4, name: 'Produkt Delta Basic', sku: 'PD-004', price: 22.5, cat: 'Kategori 2', inStock: false, rec: false },
  { id: 5, name: 'Produkt Epsilon Special', sku: 'PE-005', price: 89.0, cat: 'Kategori 3', inStock: true, rec: true },
];
