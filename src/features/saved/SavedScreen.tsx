import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Text, ActivityIndicator } from 'react-native';
import { Heart } from 'lucide-react-native';
import { PropertyCard, Property } from '../../components/PropertyCard';
import { useTheme } from '../../theme/ThemeProvider';
import { haptics } from '../../utils/haptics';
import { useFavorites, useToggleFavorite } from '../../hooks/useProperties';
import type { PropertyWithMedia } from '../../services/api/properties';

// Transform PropertyWithMedia to Property for UI
const toUiProperty = (p: PropertyWithMedia): Property => {
  return {
    id: p.id,
    title: p.title,
    price: p.price ?? undefined,
    weeklyRent: p.weekly_rent ?? undefined,
    isRental: p.is_rental,
    suburb: p.suburb,
    address: p.address ?? '',
    bedrooms: p.bedrooms ?? 0,
    bathrooms: p.bathrooms ?? 0,
    parking: p.parking ?? 0,
    thumbnailUrl: p.thumbnail_url ?? '',
    propertyType: p.property_type,
  };
};

export const SavedScreen: React.FC = () => {
  const { colors, typography } = useTheme();
  const { data: favorites = [], isLoading, error } = useFavorites();
  const toggleFavorite = useToggleFavorite();

  const handlePropertyPress = (property: Property) => {
    haptics.medium();
    // TODO: Navigate to property detail
    console.log('Property pressed:', property.id);
  };

  const handleFavorite = async (propertyId: string) => {
    const isCurrentlyFavorited = favorites.some(p => p.id === propertyId);
    
    try {
      await toggleFavorite.mutateAsync({ 
        propertyId, 
        isFavorited: isCurrentlyFavorited 
      });
      
      if (isCurrentlyFavorited) {
        haptics.warning();
      } else {
        haptics.success();
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      haptics.error();
    }
  };

  const renderProperty = ({ item }: { item: PropertyWithMedia }) => {
    const uiProperty = toUiProperty(item);
    return (
      <PropertyCard
        property={uiProperty}
        onPress={() => handlePropertyPress(uiProperty)}
        onFavorite={() => handleFavorite(item.id)}
        isFavorited={true} // All items in saved screen are favorited
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Heart size={48} color={colors.muted} />
      <Text style={[styles.emptyTitle, typography.h3, { color: colors.text }]}>
        No Saved Properties
      </Text>
      <Text style={[styles.emptySubtitle, typography.body, { color: colors.muted }]}>
        Properties you save will appear here
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyTitle, typography.h3, { color: colors.danger }]}>
        Failed to Load Favorites
      </Text>
      <Text style={[styles.emptySubtitle, typography.body, { color: colors.muted }]}>
        Please check your connection and try again
      </Text>
    </View>
  );

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.surfaceAlt }]}>
        {renderError()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surfaceAlt }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, typography.h2, { color: colors.text }]}>
          Saved Properties
        </Text>
        <Text style={[styles.subtitle, typography.body, { color: colors.muted }]}>
          {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, typography.body, { color: colors.muted }]}>
            Loading favorites...
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderProperty}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
});
