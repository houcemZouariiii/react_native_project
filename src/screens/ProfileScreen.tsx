import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

interface ProfileScreenProps {
  navigation: any;
  route?: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { user, isLoggedIn, logout, updateAvatar } = useAuth();
  const { favoriteIds } = useFavorites();

  const userName = route?.params?.userName || user?.name || 'Guest';
  const email = route?.params?.email || user?.email || 'guest@coffeeapp.com';
  const avatar = user?.avatar || 'https://i.pravatar.cc/150?img=1';
  
  // Dynamic stats
  const ordersCount = user?.ordersCount || 0;
  const points = user?.points || 0;
  const favoritesCount = favoriteIds.length;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          Alert.alert('Logged out', 'You have been logged out successfully.');
        },
      },
    ]);
  };

  const handleChangePhoto = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 500,
        maxHeight: 500,
      },
      async (response: ImagePickerResponse) => {
        if (response.assets && response.assets[0]?.uri) {
          await updateAvatar(response.assets[0].uri);
        }
      }
    );
  };

  const menuItems = [
    { icon: '📦', label: 'My Orders', onPress: () => {} },
    { icon: '💳', label: 'Payment Methods', onPress: () => {} },
    { icon: '📍', label: 'Delivery Addresses', onPress: () => {} },
    { icon: '🎁', label: 'Rewards & Points', onPress: () => {} },
    { icon: '⚙️', label: 'Settings', onPress: () => {} },
    { icon: '❓', label: 'Help & Support', onPress: () => {} },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <TouchableOpacity
            style={styles.editAvatarBtn}
            onPress={handleChangePhoto}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.userName, { color: theme.text }]}>{userName}</Text>
        <Text style={[styles.email, { color: theme.textSecondary }]}>{email}</Text>
      </View>

      {/* Stats */}
      <View style={[styles.statsContainer, { backgroundColor: theme.card }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.text }]}>{ordersCount}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Orders
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.text }]}>{points}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Points
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.text }]}>{favoritesCount}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Favorites
          </Text>
        </View>
      </View>

      {/* Theme Toggle */}
      <View style={[styles.themeToggle, { backgroundColor: theme.card }]}>
        <View style={styles.themeRow}>
          <Text style={styles.themeIcon}>{isDarkMode ? '🌙' : '☀️'}</Text>
          <Text style={[styles.themeLabel, { color: theme.text }]}>
            Dark Mode
          </Text>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: '#ccc', true: '#2D5A3D' }}
          thumbColor="#fff"
        />
      </View>

      {/* Menu Items */}
      <View style={[styles.menuContainer, { backgroundColor: theme.card }]}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index < menuItems.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
              },
            ]}
            onPress={item.onPress}
            activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={[styles.menuLabel, { color: theme.text }]}>
                {item.label}
              </Text>
            </View>
            <Text style={[styles.menuArrow, { color: theme.textSecondary }]}>
              ›
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        activeOpacity={0.8}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#2D5A3D',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2D5A3D',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editIcon: {
    fontSize: 14,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  themeToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 22,
    fontWeight: '300',
  },
  logoutBtn: {
    marginHorizontal: 20,
    marginTop: 30,
    backgroundColor: '#2D5A3D',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  bottomPadding: {
    height: 40,
  },
});

export default ProfileScreen;
