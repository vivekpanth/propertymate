import React from 'react';
import { render } from '@testing-library/react-native';
import { PropertyCard, Property } from '../src/components/PropertyCard';

// Mock the theme context
jest.mock('../src/theme/ThemeProvider', () => ({
  useTheme: () => ({
    colors: {
      primary: '#335CFF',
      accent: '#00C2A8',
      text: '#111827',
      muted: '#6B7280',
      surface: '#FFFFFF',
      surfaceAlt: '#F8FAFC',
      danger: '#EF4444',
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
    radius: { sm: 8, md: 12, lg: 16, pill: 9999 },
    shadows: { sm: {}, md: {}, lg: {} },
    typography: {
      h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
      h2: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
      h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
      body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
      bodyBold: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
      caption: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
      captionBold: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
      small: { fontSize: 12, fontWeight: '400', lineHeight: 16 }
    },
  }),
}));

// Mock the haptics utility
jest.mock('../src/utils/haptics', () => ({
  haptics: {
    light: jest.fn(),
    medium: jest.fn(),
    heavy: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    selection: jest.fn(),
  },
}));

const mockProperty: Property = {
  id: '1',
  title: 'Modern 2BR Apartment in CBD',
  price: 850000,
  isRental: false,
  suburb: 'Sydney CBD',
  address: '123 George Street',
  bedrooms: 2,
  bathrooms: 2,
  parking: 1,
  thumbnailUrl: 'https://example.com/image.jpg',
  propertyType: 'apartment',
};

describe('PropertyCard', () => {
  it('renders correctly for sale property', () => {
    const { toJSON } = render(
      <PropertyCard
        property={mockProperty}
        onPress={jest.fn()}
        onFavorite={jest.fn()}
        isFavorited={false}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders correctly for rental property', () => {
    const rentalProperty: Property = {
      ...mockProperty,
      id: '2',
      price: undefined,
      weeklyRent: 650,
      isRental: true,
    };

    const { toJSON } = render(
      <PropertyCard
        property={rentalProperty}
        onPress={jest.fn()}
        onFavorite={jest.fn()}
        isFavorited={true}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
