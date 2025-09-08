import { supabase } from '../supabase';
import { Property, PropertyMedia } from '../../types/property';

export interface PropertyWithMedia extends Property {
  media: PropertyMedia[];
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
};
