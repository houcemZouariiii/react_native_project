import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { getCategories, getProducts } from '../services/storage';
import { Category, Product } from '../types';
import HeartIcon from '../components/HeartIcon';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
  route?: any;
}

type SortOption = 'default' | 'price-low' | 'price-high' | 'rating';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const { theme, isDarkMode } = useTheme();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user, isLoggedIn } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('default');

  const userName = route?.params?.userName || user?.name || 'Guest';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      setCategories(cats);
      setProducts(prods);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== '1') {
      filtered = filtered.filter((p) => p.categoryId === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Sort products
    switch (sortOption) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, selectedCategory, searchQuery, sortOption]);

  const specialOffers = useMemo(() => {
    return products.filter((p) => p.isSpecialOffer);
  }, [products]);

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

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} DT`;
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#5a3b2dff" />
      </View>
    );
  }

  const renderCategoryItem = (category: Category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryItem,
        {
          backgroundColor:
            selectedCategory === category.id ? '#2D5A3D' : '#F5F5F5',
        },
      ]}
      onPress={() => setSelectedCategory(category.id)}
      activeOpacity={0.7}>
      {category.image ? (
        <Image source={{ uri: category.image }} style={styles.categoryImage} />
      ) : (
        <Text style={styles.categoryIcon}>{category.icon}</Text>
      )}
      <Text
        style={[
          styles.categoryName,
          {
            color: selectedCategory === category.id ? '#fff' : '#333',
          },
        ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProductCard = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={[styles.productCard, { backgroundColor: '#FFFFFF' }]}
      onPress={() => navigation.navigate('ProductDetail', { product })}
      activeOpacity={0.8}>
      <View style={styles.productImageContainer}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={() => toggleFavorite(product.id)}>
          <HeartIcon
            filled={isFavorite(product.id)}
            size={18}
            color="#E57373"
            outlineColor="#E57373"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: '#1a1a1a' }]} numberOfLines={1}>
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
  );

  const renderSpecialOfferCard = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={[styles.specialCard, { backgroundColor: '#FFFFFF' }]}
      onPress={() => navigation.navigate('ProductDetail', { product })}
      activeOpacity={0.8}>
      <View style={styles.productImageContainer}>
        <Image source={{ uri: product.image }} style={styles.specialImage} />
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={() => toggleFavorite(product.id)}>
          <HeartIcon
            filled={isFavorite(product.id)}
            size={18}
            color="#E57373"
            outlineColor="#E57373"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.specialOverlay}>
        <Text style={styles.specialName}>{product.name}</Text>
        <Text style={styles.productDescription}>With Sugar</Text>
        <View style={styles.priceRow}>
          <Text style={styles.specialPrice}>{formatPrice(product.price)}</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => handleAddToCart(product)}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: '#FFFFFF' }]}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerContainer}>
        {/* Top row with avatar, location, notification */}
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => navigation.navigate('Profile')}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>👤</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>Sfax, Tunisia</Text>
          </View>
          
          <TouchableOpacity style={styles.notificationBtn}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>
        
        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{getGreeting()}, {userName}</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Coffee ..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilterModal(true)}>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort & Filter</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.filterLabel}>Sort by</Text>
            
            <TouchableOpacity 
              style={[styles.filterOption, sortOption === 'default' && styles.filterOptionActive]}
              onPress={() => { setSortOption('default'); setShowFilterModal(false); }}
            >
              <Text style={[styles.filterOptionText, sortOption === 'default' && styles.filterOptionTextActive]}>Default</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterOption, sortOption === 'price-low' && styles.filterOptionActive]}
              onPress={() => { setSortOption('price-low'); setShowFilterModal(false); }}
            >
              <Text style={[styles.filterOptionText, sortOption === 'price-low' && styles.filterOptionTextActive]}>Price: Low to High</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterOption, sortOption === 'price-high' && styles.filterOptionActive]}
              onPress={() => { setSortOption('price-high'); setShowFilterModal(false); }}
            >
              <Text style={[styles.filterOptionText, sortOption === 'price-high' && styles.filterOptionTextActive]}>Price: High to Low</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterOption, sortOption === 'rating' && styles.filterOptionActive]}
              onPress={() => { setSortOption('rating'); setShowFilterModal(false); }}
            >
              <Text style={[styles.filterOptionText, sortOption === 'rating' && styles.filterOptionTextActive]}>Top Rated</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#1a1a1a' }]}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(renderCategoryItem)}
        </ScrollView>
      </View>

      {/* Products Grid */}
      <View style={styles.section}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsScrollContainer}
        >
          {filteredProducts.map(renderProductCard)}
        </ScrollView>
        {filteredProducts.length === 0 && (
          <Text style={[styles.noResults, { color: '#666' }]}>
            No products found
          </Text>
        )}
      </View>

      {/* Special Offers */}
      {specialOffers.length > 0 && !searchQuery && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#1a1a1a' }]}>
            Special Offer
          </Text>
          <View style={styles.specialGrid}>
            {specialOffers.map(renderSpecialOfferCard)}
          </View>
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
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
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 14,
    color: '#2D5A3D',
    marginRight: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 18,
  },
  greetingContainer: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
    opacity: 0.5,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#2D5A3D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 14,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '500',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  productsScrollContainer: {
    paddingHorizontal: 15,
    gap: 12,
  },
  productCard: {
    width: width * 0.42,
    marginHorizontal: 5,
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  productImageContainer: {
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
  specialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  specialCard: {
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
  specialImage: {
    width: '100%',
    height: 120,
  },
  specialOverlay: {
    padding: 12,
  },
  specialBadge: {
    display: 'none',
  },
  specialBadgeText: {
    display: 'none',
  },
  specialName: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '600',
  },
  specialPrice: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 15,
  },
  bottomPadding: {
    height: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  modalClose: {
    fontSize: 20,
    color: '#666',
    padding: 5,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  filterOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  filterOptionActive: {
    backgroundColor: '#2D5A3D',
  },
  filterOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  filterOptionTextActive: {
    color: '#FFFFFF',
  },
});

export default HomeScreen;

