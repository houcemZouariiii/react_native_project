// Category type
export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

// Product type
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  categoryId: string;
  rating: number;
  isSpecialOffer?: boolean;
}

// Cart item type
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: 'Small' | 'Medium' | 'Large';
  sugar: 'No Sugar' | 'Low' | 'Medium';
}

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
  ordersCount: number;
  points: number;
}

// App data structure for storage
export interface AppData {
  categories: Category[];
  products: Product[];
  cart: CartItem[];
  favorites: string[]; // Array of product IDs
  user: User | null;
  isInitialized: boolean;
}
