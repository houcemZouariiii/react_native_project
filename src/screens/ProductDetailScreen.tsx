import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { Product } from '../types';
import HeartIcon from '../components/HeartIcon';

const { width } = Dimensions.get('window');

interface ProductDetailScreenProps {
  navigation: any;
  route: any;
}

type Size = 'Small' | 'Medium' | 'Large';
type Sugar = 'No Sugar' | 'Low' | 'Medium';

const SIZES: { label: Size; icon: string; priceModifier: number }[] = [
  { label: 'Small', icon: '☕', priceModifier: 0 },
  { label: 'Medium', icon: '☕', priceModifier: 2000 },
  { label: 'Large', icon: '☕', priceModifier: 4000 },
];

const SUGAR_LEVELS: { label: Sugar; icon: string }[] = [
  { label: 'No Sugar', icon: '🚫' },
  { label: 'Low', icon: '🥄' },
  { label: 'Medium', icon: '🥄🥄' },
];

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { theme } = useTheme();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const product: Product = route.params.product;

  const [selectedSize, setSelectedSize] = useState<Size>('Medium');
  const [selectedSugar, setSelectedSugar] = useState<Sugar>('Medium');
  const [quantity, setQuantity] = useState(1);

  const sizeModifier =
    SIZES.find((s) => s.label === selectedSize)?.priceModifier || 0;
  const totalPrice = (product.price + sizeModifier) * quantity;

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} DT`;
  };

  const handleAddToCart = async () => {
    await addItem({
      productId: product.id,
      name: product.name,
      price: product.price + sizeModifier,
      image: product.image,
      quantity,
      size: selectedSize,
      sugar: selectedSugar,
    });

    Alert.alert(
      'Added to Cart!',
      `${quantity}x ${product.name} (${selectedSize}) added to your cart.`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      ]
    );
  };

  const getAboutText = () => {
    const sizeText =
      selectedSize === 'Small'
        ? 'a cozy small cup'
        : selectedSize === 'Medium'
        ? 'a perfectly balanced medium cup'
        : 'a generous large cup';

    const sugarText =
      selectedSugar === 'No Sugar'
        ? 'without any added sugar'
        : selectedSugar === 'Low'
        ? 'with just a hint of sweetness'
        : 'with a nice medium sweetness';

    return `Enjoy ${sizeText} of our ${product.name.toLowerCase()}, ${sugarText}. ${product.description}`;
  };

  return (
    <View style={styles.container}>
      {/* Full-bleed Product Image */}
      <View style={styles.imageSection}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        
        {/* Header Buttons Overlay */}
        <View style={styles.headerOverlay}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={() => toggleFavorite(product.id)}>
            <HeartIcon
              filled={isFavorite(product.id)}
              size={22}
              color="#FFFFFF"
              outlineColor="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
        
        {/* Product Title on Image */}
        <View style={styles.imageTitleOverlay}>
          <Text style={styles.imageTitle}>{product.name}</Text>
          <Text style={styles.imageSubtitle}>With Sugar</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingIcon}>⭐</Text>
            <Text style={styles.ratingText}>{product.rating}</Text>
          </View>
        </View>
      </View>

      {/* Content Card */}
      <View style={styles.contentCard}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          
          {/* Cup Size Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cup Size</Text>
            <View style={styles.optionsRow}>
              {SIZES.map((size) => (
                <TouchableOpacity
                  key={size.label}
                  style={[
                    styles.optionBtn,
                    selectedSize === size.label && styles.optionBtnActive,
                  ]}
                  onPress={() => setSelectedSize(size.label)}>
                  <Text
                    style={[
                      styles.optionLabel,
                      selectedSize === size.label && styles.optionLabelActive,
                    ]}>
                    {size.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Level Sugar Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Level Sugar</Text>
            <View style={styles.optionsRow}>
              {SUGAR_LEVELS.map((sugar) => (
                <TouchableOpacity
                  key={sugar.label}
                  style={[
                    styles.optionBtn,
                    selectedSugar === sugar.label && styles.optionBtnActive,
                  ]}
                  onPress={() => setSelectedSugar(sugar.label)}>
                  <Text
                    style={[
                      styles.optionLabel,
                      selectedSugar === sugar.label && styles.optionLabelActive,
                    ]}>
                    {sugar.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat....{' '}
              <Text style={styles.readMore}>Read More</Text>
            </Text>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={handleAddToCart}
          activeOpacity={0.8}>
          <Text style={styles.addToCartText}>Add to cart</Text>
          <View style={styles.divider} />
          <Text style={styles.priceText}>{formatPrice(totalPrice)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageSection: {
    height: 320,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    marginTop: -2,
  },
  favoriteBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageTitleOverlay: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  imageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  imageSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  ratingBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  ratingIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  optionBtnActive: {
    backgroundColor: '#2D5A3D',
    borderColor: '#2D5A3D',
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  optionLabelActive: {
    color: '#FFFFFF',
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
  readMore: {
    color: '#2D5A3D',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 30,
    backgroundColor: '#FFFFFF',
  },
  addToCartBtn: {
    flexDirection: 'row',
    backgroundColor: '#2D5A3D',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 15,
  },
  priceText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ProductDetailScreen;
