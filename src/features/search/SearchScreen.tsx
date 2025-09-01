import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Search, Filter } from 'lucide-react-native';
import { PropertyCard, Property } from '../../components/PropertyCard';
import { useTheme } from '../../theme/ThemeProvider';
import { haptics } from '../../utils/haptics';

// Mock data for demonstration
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern 2BR Apartment in CBD',
    price: 850000,
    isRental: false,
    suburb: 'Sydney CBD',
    address: '123 George Street',
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    thumbnailUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    propertyType: 'apartment',
  },
  {
    id: '2',
    title: 'Family Home with Garden',
    price: 1200000,
    isRental: false,
    suburb: 'Bondi',
    address: '456 Campbell Parade',
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    thumbnailUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    propertyType: 'house',
  },
  {
    id: '3',
    title: 'Luxury Studio Loft',
    weeklyRent: 650,
    isRental: true,
    suburb: 'Surry Hills',
    address: '789 Crown Street',
    bedrooms: 1,
    bathrooms: 1,
    parking: 0,
    thumbnailUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    propertyType: 'studio',
  },
  {
    id: '4',
    title: 'Townhouse with Garage',
    price: 950000,
    isRental: false,
    suburb: 'Glebe',
    address: '321 Glebe Point Road',
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    thumbnailUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
    propertyType: 'townhouse',
  },
];

export const SearchScreen: React.FC = () => {
  const { colors, typography } = useTheme();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handlePropertyPress = (property: Property) => {
    haptics.medium();
    // TODO: Navigate to property detail
    console.log('Property pressed:', property.id);
  };

  const handleFavorite = (propertyId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
      haptics.warning();
    } else {
      newFavorites.add(propertyId);
      haptics.success();
    }
    setFavorites(newFavorites);
  };

  const renderProperty = ({ item }: { item: Property }) => (
    <PropertyCard
      property={item}
      onPress={() => handlePropertyPress(item)}
      onFavorite={() => handleFavorite(item.id)}
      isFavorited={favorites.has(item.id)}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surfaceAlt }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.muted} />
          <Text style={[styles.searchPlaceholder, typography.body, { color: colors.muted }]}>
            Search properties...
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: colors.primary }]}
          onPress={() => haptics.light()}
        >
          <Filter size={20} color={colors.surface} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockProperties}
        renderItem={renderProperty}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchPlaceholder: {
    marginLeft: 8,
    flex: 1,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
});
