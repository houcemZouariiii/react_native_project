import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { getProducts } from '../services/storage';
import { Product } from '../types';
import HeartIcon from '../components/HeartIcon';
import EmptyState from '../components/EmptyState';

const { width } = Dimensions.get('window');

interface FavoritesScreenProps {
  navigation: any;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { addItem } = useCart();
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const allProducts = await getProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id));

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} DT`;
  };

  const handleAddToCart = async (product: Product) => {
    await addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: 'Medium',
      sugar: 'Medium',
    });
    Alert.alert('Added!', `${product.name} added to cart`);
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#2D5A3D" />
      </View>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>My Favorites</Text>
        <EmptyState
          icon="❤️"
          title="No favorites yet"
          message="Start adding your favorite coffees by tapping the heart icon on any product!"
          actionLabel="Explore Menu"
          onAction={() => navigation.navigate('Home')}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <Text style={styles.title}>Favorite</Text>

      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}>
        {favoriteProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductDetail', { product })}
            activeOpacity={0.8}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <TouchableOpacity
                style={styles.favoriteBtn}
                onPress={() => toggleFavorite(product.id)}>
                <HeartIcon
                  filled={true}
                  size={18}
                  color="#E57373"
                  outlineColor="#E57373"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.productInfo}>
              <Text
                style={styles.productName}
                numberOfLines={1}>
                {product.name}
              </Text>
              <Text style={styles.productDescription}>With Sugar</Text>
              <View style={styles.priceRow}>
                <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => handleAddToCart(product)}>
                  <Text style={styles.addBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    color: '#1a1a1a',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  productCard: {
    width: (width - 50) / 2,
    marginHorizontal: 5,
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    color: '#1a1a1a',
  },
  productDescription: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  addBtn: {
    backgroundColor: '#2D5A3D',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default FavoritesScreen;
