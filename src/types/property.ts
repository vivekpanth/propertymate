export interface Property {
  id: string;
  agent_id: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  title: string;
  price?: number;
  weekly_rent?: number;
  is_rental: boolean;
  suburb: string;
  address?: string;
  lat?: number;
  lng?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  property_type: 'apartment' | 'house' | 'studio' | 'townhouse' | 'other';
  hero_media_id?: string;
  thumbnail_url?: string;
  hero_chapters?: Record<string, unknown>;
  published_at?: string;
  created_at: string;
}

export interface PropertyMedia {
  id: string;
  property_id: string;
  media_type: 'hero' | 'area';
  area_name?: string;
  url: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  sort_order: number;
  created_at: string;
}

export interface Room {
  id: string;
  name: string;
  videoUrl: string;
  thumbnailUrl?: string;
  area_name?: string;
}
