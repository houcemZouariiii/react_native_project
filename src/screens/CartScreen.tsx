import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';

interface CartScreenProps {
  navigation: any;
}

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const { incrementOrders } = useAuth();

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} DT`;
  };

  // Calculate discount (10% off, max 5 DT)
  const discount = Math.min(subtotal * 0.1, 5);
  const deliveryFee = subtotal > 15 ? 0 : 1;
  const total = subtotal - discount + deliveryFee;

  const handleCheckout = async () => {
    await incrementOrders();
    Alert.alert(
      'Order Placed!',
      `Your order of ${formatPrice(total)} has been placed successfully! You earned 20 points!`,
      [
        {
          text: 'OK',
          onPress: () => clearCart(),
        },
      ]
    );
  };

  const handleRemoveItem = (itemId: string, itemName: string) => {
    Alert.alert('Remove Item', `Remove ${itemName} from cart?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeItem(itemId) },
    ]);
  };

  if (items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
        <Text style={styles.title}>My Cart</Text>
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Looks like you haven't added any coffee yet. Explore our menu and find your perfect brew!"
          actionLabel="Browse Menu"
          onAction={() => navigation.navigate('Home')}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <Text style={styles.title}>My Cart</Text>

      <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <View
            key={item.id}
            style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>
                {item.name}
              </Text>
              <Text style={styles.itemOptions}>
                {item.size} • {item.sugar}
              </Text>
              <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() =>
                  item.quantity > 1
                    ? updateQuantity(item.id, item.quantity - 1)
                    : handleRemoveItem(item.id, item.name)
                }>
                <Text style={styles.quantityBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>
                {item.quantity}
              </Text>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                <Text style={styles.quantityBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Order Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Subtotal
          </Text>
          <Text style={styles.summaryValue}>
            {formatPrice(subtotal)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Discount (10%)
          </Text>
          <Text style={styles.discountValue}>-{formatPrice(discount)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Delivery
          </Text>
          <Text style={styles.summaryValue}>
            {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={handleCheckout}
          activeOpacity={0.8}>
          <Text style={styles.checkoutBtnText}>Checkout</Text>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    color: '#1a1a1a',
  },
  itemsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  itemOptions: {
    fontSize: 13,
    marginBottom: 4,
    color: '#888',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2D5A3D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    color: '#1a1a1a',
  },
  summary: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#888',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2ecc71',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 15,
    marginTop: 5,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  checkoutBtn: {
    backgroundColor: '#2D5A3D',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default CartScreen;
