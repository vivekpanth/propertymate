import { z } from 'zod';
import { supabase } from '../supabase';
import type { Property } from '../../types/property';

export const propertySchema = z.object({
  title: z.string().min(3, 'Title is required'),
  suburb: z.string().min(2, 'Suburb is required'),
  address: z.string().optional(),
  property_type: z.enum(['apartment', 'house', 'studio', 'townhouse', 'other']),
  is_rental: z.boolean().default(false),
  price: z.number().int().positive().optional(),
  weekly_rent: z.number().int().positive().optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  parking: z.number().int().min(0).optional(),
});

export type NewPropertyInput = z.infer<typeof propertySchema>;

export const agentPropertiesApi = {
  async createProperty(input: NewPropertyInput): Promise<Property> {
    const parsed = propertySchema.safeParse(input);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((issue) => issue.message).join(', ');
      throw new Error(messages);
    }
    // Ensure mutually exclusive price vs weekly_rent is respected if needed
    const payload = { ...parsed.data, status: 'draft' as const };

    const { data, error } = await supabase
      .from('properties')
      .insert(payload)
      .select('*')
      .single();

    if (error) throw error;
    return data as Property;
  },

  async updateProperty(id: string, input: Partial<NewPropertyInput>): Promise<Property> {
    if (!id) throw new Error('Property id is required');
    const parsed = propertySchema.partial().safeParse(input);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((issue) => issue.message).join(', ');
      throw new Error(messages);
    }

    const { data, error } = await supabase
      .from('properties')
      .update(parsed.data)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data as Property;
  },

  async submitForReview(id: string): Promise<Property> {
    if (!id) throw new Error('Property id is required');
    const { data, error } = await supabase
      .from('properties')
      .update({ status: 'review' })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data as Property;
  },
};


