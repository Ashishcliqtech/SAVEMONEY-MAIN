import { supabase } from '../../lib/supabase';
import { Category } from '../../types';
import { Tables, Inserts, Updates } from '../../lib/supabase';

export const categoryService = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.warn('Categories table not found, using fallback:', error.message);
        throw error;
      }
      return data as Category[];
    } catch (error) {
      console.warn('Failed to fetch categories from Supabase:', error);
      throw error;
    }
  },

  // Get single category
  async getCategory(id: string): Promise<Category> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          stores(*),
          offers(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Category;
    } catch (error) {
      console.warn('Failed to fetch category from Supabase:', error);
      throw error;
    }
  },

  // Create category
  async createCategory(categoryData: Inserts<'categories'>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  },

  // Update category
  async updateCategory(id: string, updates: Updates<'categories'>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  },

  // Delete category
  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get category with stores and offers
  async getCategoryWithContent(id: string) {
    const [categoryResult, storesResult, offersResult] = await Promise.all([
      supabase.from('categories').select('*').eq('id', id).single(),
      supabase.from('stores').select('*').eq('category_id', id).eq('is_active', true),
      supabase.from('offers').select(`
        *,
        store:stores(*)
      `).eq('category_id', id).eq('is_active', true)
    ]);

    if (categoryResult.error) throw categoryResult.error;
    if (storesResult.error) throw storesResult.error;
    if (offersResult.error) throw offersResult.error;

    return {
      category: categoryResult.data as Category,
      stores: storesResult.data,
      offers: offersResult.data,
    };
  },
};