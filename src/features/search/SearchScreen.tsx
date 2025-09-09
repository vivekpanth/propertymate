import React, { useEffect, useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator, Modal, Text } from 'react-native';
import { Search, Filter, X } from 'lucide-react-native';
import { PropertyCard, Property } from '../../components/PropertyCard';
import { useTheme } from '../../theme/ThemeProvider';
import { haptics } from '../../utils/haptics';
import { useSearchProperties } from '../../hooks/useProperties';

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
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;
  const [results, setResults] = useState<Property[]>(mockProperties);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
  });


  // Debounce query input
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(id);
  }, [query]);

  const { data, isLoading, isFetching } = useSearchProperties(
    debouncedQuery || undefined,
    undefined,
    page,
    pageSize
  );

  // Filter mock data based on query and filters
  const filteredMockData = useMemo(() => {
    let filtered = [...mockProperties];
    
    // Filter by search query
    if (debouncedQuery) {
      const searchTerm = debouncedQuery.toLowerCase();
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchTerm) ||
        property.suburb.toLowerCase().includes(searchTerm) ||
        property.address.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply filters
    if (filters.minPrice) {
      const minPrice = parseInt(filters.minPrice);
      if (!isNaN(minPrice)) {
        filtered = filtered.filter(property => 
          property.price ? property.price >= minPrice : false
        );
      }
    }
    
    if (filters.maxPrice) {
      const maxPrice = parseInt(filters.maxPrice);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter(property => 
          property.price ? property.price <= maxPrice : false
        );
      }
    }
    
    if (filters.bedrooms) {
      const bedrooms = parseInt(filters.bedrooms);
      if (!isNaN(bedrooms)) {
        filtered = filtered.filter(property => 
          property.bedrooms ? property.bedrooms >= bedrooms : false
        );
      }
    }
    
    if (filters.bathrooms) {
      const bathrooms = parseInt(filters.bathrooms);
      if (!isNaN(bathrooms)) {
        filtered = filtered.filter(property => 
          property.bathrooms ? property.bathrooms >= bathrooms : false
        );
      }
    }
    
    if (filters.propertyType) {
      filtered = filtered.filter(property => 
        property.propertyType === filters.propertyType
      );
    }
    
    return filtered;
  }, [debouncedQuery, filters]);

  // Use filtered mock data instead of API data for now
  useEffect(() => {
    setResults(filteredMockData);
  }, [filteredMockData]);

  const handlePropertyPress = (property: Property) => {
    haptics.medium();
    // TODO: Navigate to property detail
    console.log('Property pressed:', property.id);
  };

  const handleFavorite = async (propertyId: string) => {
    // For now, we'll use a simple local state since we don't have real favorites data
    // In a real app, this would use the toggleFavorite mutation
    try {
      // This is a mock implementation - in reality you'd call:
      // await toggleFavorite.mutateAsync({ propertyId, isFavorited: false });
      haptics.success();
      console.log('Property favorited:', propertyId);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      haptics.error();
    }
  };

  const renderProperty = ({ item }: { item: Property }) => (
    <PropertyCard
      property={item}
      onPress={() => handlePropertyPress(item)}
      onFavorite={() => handleFavorite(item.id)}
      isFavorited={false} // Mock - would use real favorite state
    />
  );

  const hasMore = useMemo(() => {
    if (!data) return false;
    const totalLoaded = results.length;
    return totalLoaded < (data.total || 0);
  }, [data, results.length]);

  const loadMore = () => {
    if (isFetching || isLoading) return;
    if (hasMore) setPage((p) => p + 1);
  };

  const handleFilterPress = () => {
    haptics.light();
    setShowFilters(true);
  };

  const handleApplyFilters = () => {
    haptics.success();
    setShowFilters(false);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
    });
    haptics.warning();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surfaceAlt }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, typography.body, { color: colors.text }]}
            placeholder="Search properties..."
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={(t) => setQuery(t)}
            returnKeyType="search"
            onSubmitEditing={() => setDebouncedQuery(query.trim())}
          />
        </View>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: colors.primary }]}
          onPress={handleFilterPress}
        >
          <Filter size={20} color={colors.surface} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={results}
        renderItem={renderProperty}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={loadMore}
        ListFooterComponent={
          isFetching || isLoading ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator size={20} color={colors.muted} />
            </View>
          ) : null
        }
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.muted + '20' }]}>
            <Text style={[styles.modalTitle, typography.h2, { color: colors.text }]}>
              Filters
            </Text>
            <TouchableOpacity
              onPress={() => setShowFilters(false)}
              style={styles.closeButton}
            >
              <X size={24} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.filterGroup}>
              <Text style={[styles.filterLabel, typography.bodyBold, { color: colors.text }]}>
                Price Range
              </Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.filterInput, { borderColor: colors.muted + '40', color: colors.text }]}
                  placeholder="Min Price"
                  placeholderTextColor={colors.muted}
                  value={filters.minPrice}
                  onChangeText={(text) => setFilters(prev => ({ ...prev, minPrice: text }))}
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.filterInput, { borderColor: colors.muted + '40', color: colors.text }]}
                  placeholder="Max Price"
                  placeholderTextColor={colors.muted}
                  value={filters.maxPrice}
                  onChangeText={(text) => setFilters(prev => ({ ...prev, maxPrice: text }))}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.filterGroup}>
              <Text style={[styles.filterLabel, typography.bodyBold, { color: colors.text }]}>
                Bedrooms & Bathrooms
              </Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.filterInput, { borderColor: colors.muted + '40', color: colors.text }]}
                  placeholder="Min Bedrooms"
                  placeholderTextColor={colors.muted}
                  value={filters.bedrooms}
                  onChangeText={(text) => setFilters(prev => ({ ...prev, bedrooms: text }))}
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.filterInput, { borderColor: colors.muted + '40', color: colors.text }]}
                  placeholder="Min Bathrooms"
                  placeholderTextColor={colors.muted}
                  value={filters.bathrooms}
                  onChangeText={(text) => setFilters(prev => ({ ...prev, bathrooms: text }))}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.filterGroup}>
              <Text style={[styles.filterLabel, typography.bodyBold, { color: colors.text }]}>
                Property Type
              </Text>
              <View style={styles.propertyTypeRow}>
                {['apartment', 'house', 'studio', 'townhouse'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.propertyTypeChip,
                      { 
                        backgroundColor: filters.propertyType === type ? colors.primary : colors.surfaceAlt,
                        borderColor: colors.muted + '40'
                      }
                    ]}
                    onPress={() => setFilters(prev => ({ 
                      ...prev, 
                      propertyType: filters.propertyType === type ? '' : type 
                    }))}
                  >
                    <Text style={[
                      typography.caption,
                      { color: filters.propertyType === type ? colors.surface : colors.text }
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={[styles.modalFooter, { borderTopColor: colors.muted + '20' }]}>
            <TouchableOpacity
              style={[styles.clearButton, { borderColor: colors.muted + '40' }]}
              onPress={handleClearFilters}
            >
              <Text style={[typography.bodyBold, { color: colors.muted }]}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
              onPress={handleApplyFilters}
            >
              <Text style={[typography.bodyBold, { color: colors.surface }]}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
  searchInput: {
    marginLeft: 8,
    flex: 1,
    paddingVertical: 0,
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
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  filterGroup: {
    marginBottom: 24,
  },
  filterLabel: {
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  propertyTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  propertyTypeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
