import { Injectable, signal, computed } from '@angular/core';

// Define the user model
export interface UserModel {
  name: string;
  role: 'dueña' | 'empleada';
}

// Define the shape of the authentication state
export interface AuthState {
  user: UserModel | null;
  token: string | null;
}

// Define the initial state
const initialState: AuthState = {
  user: null,
  token: null,
};

@Injectable({
  providedIn: 'root',
})
export class AppStore {
  // Create a private signal for the entire state slice
  private readonly state = signal<AuthState>(initialState);

  // Use computed signals to derive and expose parts of the state
  public readonly user = computed(() => this.state().user);
  public readonly token = computed(() => this.state().token);
  public readonly isAuthenticated = computed(() => !!this.state().token);
  public readonly userRole = computed(() => this.state().user?.role);

  // Method to set the state after login
  loginSuccess(newState: AuthState) {
    this.state.set(newState);
  }

  // Method to reset the state after logout
  logout() {
    this.state.set(initialState);
  }
}
