import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category, Product, CartItem, User } from '../types';
import { SEED_CATEGORIES, SEED_PRODUCTS } from '../data/seedData';

// Storage keys
const STORAGE_KEYS = {
  CATEGORIES: '@coffee_app_categories',
  PRODUCTS: '@coffee_app_products',
  CART: '@coffee_app_cart',
  FAVORITES: '@coffee_app_favorites',
  USER: '@coffee_app_user',
  IS_INITIALIZED: '@coffee_app_initialized',
};

// Initialize app data with seed data if first launch
export const initializeAppData = async (): Promise<void> => {
  try {
    const isInitialized = await AsyncStorage.getItem(STORAGE_KEYS.IS_INITIALIZED);

    if (!isInitialized) {
      // First launch - seed the data
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES)],
        [STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS)],
        [STORAGE_KEYS.CART, JSON.stringify([])],
        [STORAGE_KEYS.FAVORITES, JSON.stringify([])],
        [STORAGE_KEYS.IS_INITIALIZED, 'true'],
      ]);
    }
  } catch (error) {
    console.error('Error initializing app data:', error);
    throw error;
  }
};

// Check if app is initialized
export const isAppInitialized = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.IS_INITIALIZED);
    return value === 'true';
  } catch (error) {
    console.error('Error checking initialization:', error);
    return false;
  }
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

// Products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const products = await getProducts();
    return products.find((p) => p.id === id) || null;
  } catch (error) {
    console.error('Error getting product by id:', error);
    return null;
  }
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  try {
    const products = await getProducts();
    if (categoryId === '1') return products; // 'All' category
    return products.filter((p) => p.categoryId === categoryId);
  } catch (error) {
    console.error('Error getting products by category:', error);
    return [];
  }
};

export const getSpecialOffers = async (): Promise<Product[]> => {
  try {
    const products = await getProducts();
    return products.filter((p) => p.isSpecialOffer);
  } catch (error) {
    console.error('Error getting special offers:', error);
    return [];
  }
};

// Cart
export const getCart = async (): Promise<CartItem[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CART);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
};

export const saveCart = async (cart: CartItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart:', error);
    throw error;
  }
};

export const addToCart = async (item: CartItem): Promise<CartItem[]> => {
  try {
    const cart = await getCart();
    // Check if item with same product, size, and sugar already exists
    const existingIndex = cart.findIndex(
      (i) =>
        i.productId === item.productId &&
        i.size === item.size &&
        i.sugar === item.sugar
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += item.quantity;
    } else {
      cart.push({ ...item, id: Date.now().toString() });
    }

    await saveCart(cart);
    return cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItemQuantity = async (
  itemId: string,
  quantity: number
): Promise<CartItem[]> => {
  try {
    let cart = await getCart();
    if (quantity <= 0) {
      cart = cart.filter((i) => i.id !== itemId);
    } else {
      cart = cart.map((i) => (i.id === itemId ? { ...i, quantity } : i));
    }
    await saveCart(cart);
    return cart;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeFromCart = async (itemId: string): Promise<CartItem[]> => {
  try {
    const cart = await getCart();
    const updatedCart = cart.filter((i) => i.id !== itemId);
    await saveCart(updatedCart);
    return updatedCart;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const clearCart = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// Favorites
export const getFavorites = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const saveFavorites = async (favorites: string[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites:', error);
    throw error;
  }
};

export const toggleFavorite = async (productId: string): Promise<string[]> => {
  try {
    const favorites = await getFavorites();
    const index = favorites.indexOf(productId);
    if (index >= 0) {
      favorites.splice(index, 1);
    } else {
      favorites.push(productId);
    }
    await saveFavorites(favorites);
    return favorites;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

export const isFavorite = async (productId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.includes(productId);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};

// User
export const getUser = async (): Promise<User | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const saveUser = async (user: User | null): Promise<void> => {
  try {
    if (user) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    }
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

// Clear all data (for logout/reset)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.CART,
      STORAGE_KEYS.FAVORITES,
      STORAGE_KEYS.USER,
    ]);
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};
