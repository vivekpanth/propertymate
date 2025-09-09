import { supabase } from '../supabase';
import { Property, PropertyMedia } from '../../types/property';

export interface PropertyWithMedia extends Property {
  media: PropertyMedia[];
}

interface FavoriteWithProperty {
  property_id: string;
  properties: PropertyWithMedia;
}

export const propertiesApi = {
  // Get published properties for feed
  async getPublishedProperties(): Promise<PropertyWithMedia[]> {
    const { data: properties, error } = await supabase
      .from('properties')
      .select(`
        *,
        media:property_media(*)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    return properties || [];
  },

  // Search properties with optional filters and pagination
  async searchPublishedProperties(params: {
    query?: string;
    filters?: {
      minPrice?: number;
      maxPrice?: number;
      bedrooms?: number;
      bathrooms?: number;
      isRental?: boolean;
      suburb?: string;
      propertyType?: Property['property_type'];
    };
    page?: number; // 1-based
    pageSize?: number; // default 10
  }): Promise<{ items: PropertyWithMedia[]; total: number; page: number; pageSize: number }> {
    const { query, filters, page = 1, pageSize = 10 } = params || {};

    let qb = supabase
      .from('properties')
      .select('*, media:property_media(*)', { count: 'exact' })
      .eq('status', 'published');

    if (query && query.trim().length > 0) {
      // Search in title and suburb
      // Use ilike for case-insensitive match
      qb = qb.or(`title.ilike.%${query}%,suburb.ilike.%${query}%`);
    }

    if (filters) {
      if (typeof filters.minPrice === 'number') qb = qb.gte('price', filters.minPrice);
      if (typeof filters.maxPrice === 'number') qb = qb.lte('price', filters.maxPrice);
      if (typeof filters.bedrooms === 'number') qb = qb.gte('bedrooms', filters.bedrooms);
      if (typeof filters.bathrooms === 'number') qb = qb.gte('bathrooms', filters.bathrooms);
      if (typeof filters.isRental === 'boolean') qb = qb.eq('is_rental', filters.isRental);
      if (filters.suburb && filters.suburb.trim()) qb = qb.ilike('suburb', `%${filters.suburb}%`);
      if (filters.propertyType) qb = qb.eq('property_type', filters.propertyType);
    }

    qb = qb.order('published_at', { ascending: false });

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    qb = qb.range(from, to);

    const { data, error, count } = await qb;
    if (error) throw error;

    return {
      items: (data as PropertyWithMedia[]) || [],
      total: count || 0,
      page,
      pageSize,
    };
  },

  // Get property by ID with all media
  async getPropertyById(id: string): Promise<PropertyWithMedia | null> {
    const { data: property, error } = await supabase
      .from('properties')
      .select(`
        *,
        media:property_media(*)
      `)
      .eq('id', id)
      .eq('status', 'published')
      .single();

    if (error) throw error;
    return property;
  },

  // Get hero videos for feed
  async getHeroVideos(): Promise<PropertyWithMedia[]> {
    const { data: properties, error } = await supabase
      .from('properties')
      .select(`
        *,
        media:property_media(*)
      `)
      .eq('status', 'published')
      .not('hero_media_id', 'is', null)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return properties || [];
  },

  // Get area videos for a specific property
  async getAreaVideos(propertyId: string): Promise<PropertyMedia[]> {
    const { data: media, error } = await supabase
      .from('property_media')
      .select('*')
      .eq('property_id', propertyId)
      .eq('media_type', 'area')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return media || [];
  },

  // Get signed URL for video access
  async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) throw error;
    return data.signedUrl;
  },

  // Resolve a possibly-storage path to a playable URL
  async toPlayableUrl(rawUrl: string): Promise<string> {
    // Supported formats:
    // 1) storage://bucket/path/to/file.mp4
    // 2) bucket:path/to/file.mp4
    // otherwise treat as full URL
    if (!rawUrl) return rawUrl;
    const storageProto = rawUrl.startsWith('storage://');
    const colonIdx = rawUrl.indexOf(':');
    if (storageProto) {
      const withoutProto = rawUrl.replace('storage://', '');
      const firstSlash = withoutProto.indexOf('/');
      if (firstSlash > 0) {
        const bucket = withoutProto.slice(0, firstSlash);
        const path = withoutProto.slice(firstSlash + 1);
        try {
          return await this.getSignedUrl(bucket, path);
        } catch {
          return rawUrl;
        }
      }
    } else if (colonIdx > 0 && !rawUrl.startsWith('http')) {
      const bucket = rawUrl.slice(0, colonIdx);
      const path = rawUrl.slice(colonIdx + 1);
      try {
        return await this.getSignedUrl(bucket, path);
      } catch {
        return rawUrl;
      }
    }
    return rawUrl;
  },

  // Map hero media URLs to signed URLs when needed
  async withSignedHeroUrls(properties: PropertyWithMedia[]): Promise<PropertyWithMedia[]> {
    const resolved = await Promise.all(
      (properties || []).map(async (p) => {
        const hero = (p.media || []).find((m) => m.media_type === 'hero');
        if (hero) {
          const playable = await this.toPlayableUrl(hero.url);
          hero.url = playable;
        }
        return p;
      })
    );
    return resolved;
  },

  // Favorites API
  async addToFavorites(propertyId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .insert({ property_id: propertyId });
    
    if (error) throw error;
  },

  async removeFromFavorites(propertyId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('property_id', propertyId);
    
    if (error) throw error;
  },

  async getFavorites(): Promise<PropertyWithMedia[]> {
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select(`
        property_id,
        properties!inner(
          *,
          media:property_media(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Extract properties from the joined data
    return (favorites || []).map((fav) => (fav as unknown as FavoriteWithProperty).properties);
  },

  async isFavorited(propertyId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorites')
      .select('property_id')
      .eq('property_id', propertyId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return !!data;
  },
};
