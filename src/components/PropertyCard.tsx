import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, MapPin, Bed, Bath, Car } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { haptics } from '../utils/haptics';

export interface Property {
  id: string;
  title: string;
  price?: number;
  weeklyRent?: number;
  isRental: boolean;
  suburb: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  thumbnailUrl: string;
  propertyType: 'apartment' | 'house' | 'studio' | 'townhouse' | 'other';
}

interface PropertyCardProps {
  property: Property;
  onPress?: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onPress,
  onFavorite,
  isFavorited = false,
}) => {
  const { colors, shadows, typography } = useTheme();

  const handleFavorite = () => {
    haptics.light();
    onFavorite?.();
  };

  const formatPrice = () => {
    if (property.isRental) {
      return `$${property.weeklyRent}/week`;
    }
    return `$${property.price?.toLocaleString()}`;
  };

  return (
    <TouchableOpacity
      style={[styles.container, shadows.md]}
      onPress={() => {
        haptics.selection();
        onPress?.();
      }}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: property.thumbnailUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={[styles.favoriteButton, { backgroundColor: colors.surface }]}
          onPress={handleFavorite}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Heart
            size={20}
            color={isFavorited ? colors.danger : colors.muted}
            fill={isFavorited ? colors.danger : 'transparent'}
          />
        </TouchableOpacity>
        <View style={[styles.propertyTypeBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.propertyTypeText, { color: colors.surface }]}>
            {property.propertyType}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, typography.h3, { color: colors.text }]} numberOfLines={2}>
          {property.title}
        </Text>
        
        <View style={styles.locationContainer}>
          <MapPin size={16} color={colors.muted} />
          <Text style={[styles.location, typography.caption, { color: colors.muted }]} numberOfLines={1}>
            {property.suburb}, {property.address}
          </Text>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Bed size={16} color={colors.muted} />
            <Text style={[styles.detailText, typography.caption, { color: colors.muted }]}>
              {property.bedrooms}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Bath size={16} color={colors.muted} />
            <Text style={[styles.detailText, typography.caption, { color: colors.muted }]}>
              {property.bathrooms}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Car size={16} color={colors.muted} />
            <Text style={[styles.detailText, typography.caption, { color: colors.muted }]}>
              {property.parking}
            </Text>
          </View>
        </View>

        <Text style={[styles.price, typography.h2, { color: colors.primary }]}>
          {formatPrice()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyTypeBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  propertyTypeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    marginLeft: 4,
    flex: 1,
  },
  details: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
  },
  price: {
    fontWeight: '700',
  },
});
