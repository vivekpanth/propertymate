import { useQuery, useQueryClient, keepPreviousData, useMutation } from '@tanstack/react-query';
import { propertiesApi } from '../services/api/properties';
import { PropertyMedia, Room } from '../types/property';
import { useMemo } from 'react';
import type { PropertyWithMedia } from '../services/api/properties';

// Query keys
export const queryKeys = {
  properties: ['properties'] as const,
  publishedProperties: () => [...queryKeys.properties, 'published'] as const,
  heroVideos: () => [...queryKeys.properties, 'hero'] as const,
  property: (id: string) => [...queryKeys.properties, 'detail', id] as const,
  areaVideos: (propertyId: string) => [...queryKeys.properties, 'areas', propertyId] as const,
  search: (q: string | undefined, filters: unknown, page: number, pageSize: number) =>
    [...queryKeys.properties, 'search', q || '', JSON.stringify(filters || {}), page, pageSize] as const,
  favorites: () => [...queryKeys.properties, 'favorites'] as const,
  isFavorited: (propertyId: string) => [...queryKeys.properties, 'favorited', propertyId] as const,
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

// Search hook with pagination
export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  isRental?: boolean;
  suburb?: string;
  propertyType?: 'apartment' | 'house' | 'studio' | 'townhouse' | 'other';
}

export interface SearchResult {
  items: PropertyWithMedia[];
  total: number;
  page: number;
  pageSize: number;
}

export const useSearchProperties = (
  query: string | undefined,
  filters: SearchFilters | undefined,
  page: number,
  pageSize: number = 10
) => {
  const key = useMemo(() => queryKeys.search(query, filters, page, pageSize), [query, filters, page, pageSize]);

  return useQuery<SearchResult>({
    queryKey: key,
    queryFn: () => propertiesApi.searchPublishedProperties({ query, filters, page, pageSize }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
};

// Favorites hooks
export const useFavorites = () => {
  return useQuery({
    queryKey: queryKeys.favorites(),
    queryFn: propertiesApi.getFavorites,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useIsFavorited = (propertyId: string) => {
  return useQuery({
    queryKey: queryKeys.isFavorited(propertyId),
    queryFn: () => propertiesApi.isFavorited(propertyId),
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, isFavorited }: { propertyId: string; isFavorited: boolean }) => {
      if (isFavorited) {
        await propertiesApi.removeFromFavorites(propertyId);
      } else {
        await propertiesApi.addToFavorites(propertyId);
      }
    },
    onMutate: async ({ propertyId, isFavorited }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.isFavorited(propertyId) });
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites() });

      // Snapshot previous values
      const previousIsFavorited = queryClient.getQueryData(queryKeys.isFavorited(propertyId));
      const previousFavorites = queryClient.getQueryData(queryKeys.favorites());

      // Optimistically update
      queryClient.setQueryData(queryKeys.isFavorited(propertyId), !isFavorited);
      
      // Update favorites list
      if (isFavorited) {
        // Remove from favorites
        queryClient.setQueryData(queryKeys.favorites(), (old: PropertyWithMedia[] = []) => 
          old.filter(p => p.id !== propertyId)
        );
      } else {
        // Add to favorites - we'd need the property data, so we'll refetch
        queryClient.invalidateQueries({ queryKey: queryKeys.favorites() });
      }

      return { previousIsFavorited, previousFavorites };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousIsFavorited !== undefined) {
        queryClient.setQueryData(queryKeys.isFavorited(variables.propertyId), context.previousIsFavorited);
      }
      if (context?.previousFavorites) {
        queryClient.setQueryData(queryKeys.favorites(), context.previousFavorites);
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.isFavorited(variables.propertyId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites() });
    },
  });
};
