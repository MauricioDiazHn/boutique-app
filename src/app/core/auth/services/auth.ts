import { Injectable, inject } from '@angular/core';
import { AppStore, UserModel } from '../../state/app.store';
import { SupabaseService } from '../../supabase.service';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly store = inject(AppStore);
  private readonly supabase = inject(SupabaseService).client;

  constructor() {
    this.supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (session && session.user) {
          const userProfile = await this.getProfile(session.user);
          if (userProfile) {
             this.store.loginSuccess({ user: userProfile, token: session.access_token });
          } else {
             // Handle case where user is authenticated but profile is missing
             console.error('User is authenticated but profile could not be retrieved.');
             this.store.logout();
          }
        } else {
          this.store.logout();
        }
      }
    );
  }

  async login(credentials: { email: string; pass: string }) {
    const { error } = await this.supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.pass,
    });
    if (error) throw error;
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  private async getProfile(user: User): Promise<UserModel | null> {
    try {
      const { data, error, status } = await this.supabase
        .from('profiles')
        .select(`full_name, role`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        // The cast is safe here because RLS ensures only valid roles can exist.
        // In a more complex app, you might add runtime validation.
        return { name: data.full_name, role: data.role as 'dueña' | 'empleada' };
      }
    } catch (error) {
      console.error('Error retrieving user profile:', error);
    }
    return null;
  }
}
