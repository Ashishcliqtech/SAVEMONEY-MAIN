import { supabase } from '../../lib/supabase';

export interface ContentSection {
  id?: string;
  name: string;
  type: 'hero' | 'featured' | 'highlighted' | 'banner' | 'testimonial';
  content: Record<string, any>;
  position: number;
  devices: ('desktop' | 'tablet' | 'mobile')[];
  isActive: boolean;
  scheduledDate?: string;
}

export const contentService = {
  // Get all content sections
  async getContentSections(): Promise<ContentSection[]> {
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .order('position', { ascending: true });

    if (error) throw error;
    return data as ContentSection[];
  },

  // Get active content sections for public display
  async getActiveContentSections(): Promise<ContentSection[]> {
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .eq('is_active', true)
      .or('scheduled_date.is.null,scheduled_date.lte.now()')
      .order('position', { ascending: true });

    if (error) throw error;
    return data as ContentSection[];
  },

  // Create content section
  async createContentSection(sectionData: Omit<ContentSection, 'id'>): Promise<ContentSection> {
    const { data, error } = await supabase
      .from('content_sections')
      .insert(sectionData)
      .select()
      .single();

    if (error) throw error;
    return data as ContentSection;
  },

  // Update content section
  async updateContentSection(id: string, updates: Partial<ContentSection>): Promise<ContentSection> {
    const { data, error } = await supabase
      .from('content_sections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ContentSection;
  },

  // Delete content section
  async deleteContentSection(id: string): Promise<void> {
    const { error } = await supabase
      .from('content_sections')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get featured offers configuration
  async getFeaturedOffers() {
    const { data, error } = await supabase
      .from('featured_offers')
      .select(`
        *,
        offer:offers(
          *,
          store:stores(*)
        )
      `)
      .eq('is_active', true)
      .or('end_date.is.null,end_date.gt.now()')
      .order('position', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Add offer to featured section
  async addFeaturedOffer(
    offerId: string, 
    sectionType: 'hero' | 'featured' | 'trending' | 'exclusive',
    position: number,
    startDate?: string,
    endDate?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('featured_offers')
      .insert({
        offer_id: offerId,
        section_type: sectionType,
        position,
        start_date: startDate,
        end_date: endDate,
        is_active: true,
      });

    if (error) throw error;
  },

  // Remove offer from featured section
  async removeFeaturedOffer(id: string): Promise<void> {
    const { error } = await supabase
      .from('featured_offers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Update featured offer position
  async updateFeaturedOfferPosition(id: string, position: number): Promise<void> {
    const { error } = await supabase
      .from('featured_offers')
      .update({ position })
      .eq('id', id);

    if (error) throw error;
  },
};