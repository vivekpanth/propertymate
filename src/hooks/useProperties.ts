import { useQuery, useQueryClient } from '@tanstack/react-query';
import { propertiesApi } from '../services/api/properties';
import { PropertyMedia, Room } from '../types/property';

// Query keys
export const queryKeys = {
  properties: ['properties'] as const,
  publishedProperties: () => [...queryKeys.properties, 'published'] as const,
  heroVideos: () => [...queryKeys.properties, 'hero'] as const,
  property: (id: string) => [...queryKeys.properties, 'detail', id] as const,
  areaVideos: (propertyId: string) => [...queryKeys.properties, 'areas', propertyId] as const,
};

// Get published properties for feed
export const usePublishedProperties = () => {
  return useQuery({
    queryKey: queryKeys.publishedProperties(),
    queryFn: propertiesApi.getPublishedProperties,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get hero videos for feed
export const useHeroVideos = () => {
  return useQuery({
    queryKey: queryKeys.heroVideos(),
    queryFn: async () => {
      const data = await propertiesApi.getHeroVideos();
      return propertiesApi.withSignedHeroUrls(data);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Get property by ID
export const useProperty = (id: string) => {
  return useQuery({
    queryKey: queryKeys.property(id),
    queryFn: () => propertiesApi.getPropertyById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Get area videos for a property
export const useAreaVideos = (propertyId: string) => {
  return useQuery({
    queryKey: queryKeys.areaVideos(propertyId),
    queryFn: () => propertiesApi.getAreaVideos(propertyId),
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000,
  });
};

// Transform property media to rooms for AreasGallery
export const usePropertyRooms = (propertyId: string): Room[] => {
  const { data: areaVideos = [] } = useAreaVideos(propertyId);
  
  return areaVideos.map((media: PropertyMedia) => ({
    id: media.id,
    name: media.area_name || 'Room',
    videoUrl: media.url,
    thumbnailUrl: media.thumbnail_url,
    area_name: media.area_name,
  }));
};

// Prefetch property data
export const usePrefetchProperty = () => {
  const queryClient = useQueryClient();
  
  return (propertyId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.property(propertyId),
      queryFn: () => propertiesApi.getPropertyById(propertyId),
      staleTime: 5 * 60 * 1000,
    });
    
    queryClient.prefetchQuery({
      queryKey: queryKeys.areaVideos(propertyId),
      queryFn: () => propertiesApi.getAreaVideos(propertyId),
      staleTime: 5 * 60 * 1000,
    });
  };
};
