// Core domain interfaces and state definitions for NAVE ShopBoard.

export interface Product {
  readonly id: number;
  readonly name: string;
  readonly category: string;
  readonly price: number;
  readonly image: string;
  readonly color?: string;
}

export interface CartItem {
  readonly id: number;
  readonly qty: number;
}

export interface CartTotals {
  readonly count: number;
  readonly subtotal: number;
}

export interface CartState {
  readonly items: readonly CartItem[];
  readonly count: number;
  readonly subtotal: number;
}

export type SortOrder = "default" | "price-asc" | "price-desc";
