import { Injectable, inject } from '@angular/core';
import { SupabaseService } from 'src/app/core/supabase.service';

// This interface should match the 'services' table in Supabase
export interface BoutiqueService {
  id: number;
  name: string;
  description: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private supabase = inject(SupabaseService).client;

  async getServices(): Promise<BoutiqueService[]> {
    const { data, error } = await this.supabase.from('services').select('*');
    if (error) {
      console.error('Error fetching services:', error);
      return [];
    }
    return data || [];
  }

  async addService(serviceData: Omit<BoutiqueService, 'id'>): Promise<BoutiqueService | null> {
    const { data, error } = await this.supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single();

    if (error) {
      console.error('Error adding service:', error);
      throw error;
    }
    return data;
  }

  async updateService(id: number, serviceData: Partial<Omit<BoutiqueService, 'id'>>): Promise<BoutiqueService | null> {
    const { data, error } = await this.supabase
      .from('services')
      .update(serviceData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating service:', error);
      throw error;
    }
    return data;
  }

  // RLS policy ensures only 'dueña' can do this.
  async deleteService(id: number): Promise<void> {
    const { error } = await this.supabase.from('services').delete().eq('id', id);
    if (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }
}
