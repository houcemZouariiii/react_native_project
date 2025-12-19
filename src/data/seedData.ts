import { Category, Product } from '../types';

export const SEED_CATEGORIES: Category[] = [
  { id: '1', name: 'All', icon: '☕', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200' },
  { id: '2', name: 'Espresso', icon: '☕', image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=200' },
  { id: '3', name: 'Latte', icon: '🥛', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200' },
  { id: '4', name: 'Cappuccino', icon: '☕', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200' },
  { id: '5', name: 'Mocha', icon: '🍫', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=200' },
  { id: '6', name: 'Cold Brew', icon: '🧊', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=200' },
  { id: '7', name: 'Frappe', icon: '🥤', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200' },
  { id: '8', name: 'Tea', icon: '🍵', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=200' },
];

export const SEED_PRODUCTS: Product[] = [
  // Espresso
  {
    id: '1',
    name: 'Classic Espresso',
    price: 3.5,
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400',
    description: 'Rich and bold single shot espresso made from premium Arabica beans.',
    categoryId: '2',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Double Espresso',
    price: 4.0,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
    description: 'Intense double shot for the true coffee lover.',
    categoryId: '2',
    rating: 4.9,
  },
  // Latte
  {
    id: '3',
    name: 'Vanilla Latte',
    price: 4.5,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
    description: 'Smooth espresso with steamed milk and vanilla syrup.',
    categoryId: '3',
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Caramel Latte',
    price: 4.8,
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400',
    description: 'Sweet caramel blended with espresso and creamy milk.',
    categoryId: '3',
    rating: 4.8,
  },
  {
    id: '5',
    name: 'Hazelnut Latte',
    price: 4.9,
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400',
    description: 'Nutty hazelnut flavor with smooth espresso and milk.',
    categoryId: '3',
    rating: 4.6,
  },
  // Cappuccino
  {
    id: '6',
    name: 'Classic Cappuccino',
    price: 4.2,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
    description: 'Perfect balance of espresso, steamed milk, and foam.',
    categoryId: '4',
    rating: 4.9,
  },
  {
    id: '7',
    name: 'Cinnamon Cappuccino',
    price: 4.5,
    image: 'https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?w=400',
    description: 'Warm cinnamon spice on a classic cappuccino.',
    categoryId: '4',
    rating: 4.5,
  },
  // Mocha
  {
    id: '8',
    name: 'Classic Mocha',
    price: 4.7,
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400',
    description: 'Rich chocolate meets bold espresso with steamed milk.',
    categoryId: '5',
    rating: 4.8,
  },
  {
    id: '9',
    name: 'White Mocha',
    price: 5.0,
    image: 'https://images.unsplash.com/photo-1592318951566-70f6f0ac3de8?w=400',
    description: 'Sweet white chocolate with espresso and milk.',
    categoryId: '5',
    rating: 4.7,
  },
  // Cold Brew
  {
    id: '10',
    name: 'Classic Cold Brew',
    price: 3.8,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400',
    description: 'Slow-steeped for 20 hours for smooth, bold flavor.',
    categoryId: '6',
    rating: 4.9,
  },
  {
    id: '11',
    name: 'Vanilla Cold Brew',
    price: 4.3,
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400',
    description: 'Cold brew with a hint of vanilla sweetness.',
    categoryId: '6',
    rating: 4.6,
  },
  // Frappe
  {
    id: '12',
    name: 'Caramel Frappe',
    price: 4.8,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
    description: 'Blended ice coffee with caramel and whipped cream.',
    categoryId: '7',
    rating: 4.8,
  },
  {
    id: '13',
    name: 'Mocha Frappe',
    price: 5.0,
    image: 'https://images.unsplash.com/photo-1530373239216-42518e6b4063?w=400',
    description: 'Chocolate and coffee blended with ice.',
    categoryId: '7',
    rating: 4.7,
  },
  // Tea
  {
    id: '14',
    name: 'Chai Latte',
    price: 4.0,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400',
    description: 'Spiced chai tea with steamed milk.',
    categoryId: '8',
    rating: 4.6,
  },
  {
    id: '15',
    name: 'Matcha Latte',
    price: 4.5,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400',
    description: 'Premium Japanese matcha with creamy milk.',
    categoryId: '8',
    rating: 4.8,
  },
  // Special Offers
  {
    id: '16',
    name: 'Seasonal Pumpkin Spice',
    price: 4.9,
    image: 'https://images.unsplash.com/photo-1574914629385-46e6936e9256?w=400',
    description: 'Limited edition pumpkin spice latte with real pumpkin.',
    categoryId: '3',
    rating: 4.9,
    isSpecialOffer: true,
  },
  {
    id: '17',
    name: 'Honey Lavender Latte',
    price: 4.7,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    description: 'Floral lavender with sweet honey and espresso.',
    categoryId: '3',
    rating: 4.7,
    isSpecialOffer: true,
  },
  // More variety
  {
    id: '18',
    name: 'Americano',
    price: 3.0,
    image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400',
    description: 'Espresso diluted with hot water for a smooth taste.',
    categoryId: '2',
    rating: 4.5,
  },
  {
    id: '19',
    name: 'Iced Caramel Macchiato',
    price: 4.6,
    image: 'https://images.unsplash.com/photo-1553909489-ec3175e5e0c5?w=400',
    description: 'Vanilla, milk, espresso, and caramel drizzle over ice.',
    categoryId: '3',
    rating: 4.8,
  },
  {
    id: '20',
    name: 'Green Tea Latte',
    price: 4.2,
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400',
    description: 'Earthy green tea blended with steamed milk.',
    categoryId: '8',
    rating: 4.4,
  },
];

export const AVATAR_POOL = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=4',
  'https://i.pravatar.cc/150?img=5',
];

export const getRandomAvatar = (): string => {
  return AVATAR_POOL[Math.floor(Math.random() * AVATAR_POOL.length)];
};
