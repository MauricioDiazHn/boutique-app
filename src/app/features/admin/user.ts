import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../core/supabase.service';

// This interface should match the 'profiles' table in Supabase
export interface EmployeeProfile {
  id: string; // This is a UUID from auth.users
  email: string;
  full_name: string;
  role: 'dueña' | 'empleada';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private supabase = inject(SupabaseService).client;

  /**
   * Fetches all user profiles that have the 'empleada' role.
   * RLS policy should ensure only the 'dueña' can call this successfully.
   */
  async getEmployees(): Promise<EmployeeProfile[]> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('role', 'empleada');

    if (error) {
      console.error('Error fetching employees:', error);
      return [];
    }

    return data || [];
  }

  // NOTE: Adding, updating, or deactivating employees would be handled
  // via Supabase Auth functions (e.g., inviting a user) and potentially
  // database functions or edge functions for more complex operations,
  // which is beyond the scope of this direct RLS implementation.
}
